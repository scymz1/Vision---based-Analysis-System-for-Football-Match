# --------------------------------------------------------
# SiamMask
# Licensed under The MIT License
# Written by Qiang Wang (wangqiang2015 at ia.ac.cn)
# --------------------------------------------------------
import glob
from tools.test import *
import cv2
import torchvision
from LeNet5 import CNN

parser = argparse.ArgumentParser(description='PyTorch Tracking Demo')

parser.add_argument('--resume', default='', type=str, required=True,
                    metavar='PATH',help='path to latest checkpoint (default: none)')
parser.add_argument('--config', dest='config', default='config_davis.json',
                    help='hyper-parameter of SiamMask in json format')
parser.add_argument('--base_path', default='../../data/tennis', help='datasets')
parser.add_argument('--cpu', action='store_true', help='cpu mode')
args = parser.parse_args()

if __name__ == '__main__':
    # Setup device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    torch.backends.cudnn.benchmark = True

    # Setup Model
    cfg = load_config(args)
    from custom import Custom
    siammask = Custom(anchors=cfg['anchors'])
    if args.resume:
        assert isfile(args.resume), 'Please download {} first.'.format(args.resume)
        siammask = load_pretrain(siammask, args.resume)

    siammask.eval().to(device)

    # Parse Image file
    img_files = sorted(glob.glob(join(args.base_path, '*.jp*')))
    ims = [cv2.imread(imf) for imf in img_files]

    # Select ROI
    cv2.namedWindow("SiamMask", cv2.WND_PROP_FULLSCREEN)
    # cv2.setWindowProperty("SiamMask", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
    try:
        init_rect = cv2.selectROI('SiamMask', ims[0], False, False)
        x, y, w, h = init_rect
    except:
        exit()

    toc = 0
    for f, im in enumerate(ims):
        tic = cv2.getTickCount()
        if f == 0:  # init
            target_pos = np.array([x + w / 2, y + h / 2])
            target_sz = np.array([w, h])
            state = siamese_init(im, target_pos, target_sz, siammask, cfg['hp'], device=device)  # init tracker
        elif f > 0:  # tracking
            state = siamese_track(state, im, mask_enable=True, refine_enable=True, device=device)  # track
            location = state['ploygon']
            mask = state['mask'] > state['p'].seg_thr
            
            save_path = '../resultSet/'+str(f)+'.jpg' #$$$
            # openCV.getTarget(im, target, save_path)
            x1, y1, w1, h1 = location
            points = [[x1, y1], [(x1+w1), y1], [(x1+w1), (y1+h1)], [x1, (y1+h1)]]
            target = im[y1:(y1+h1), x1:(x1+w1), :]
            resized = cv2.resize(target, (50, 50))
            cv2.imwrite(save_path, resized)
            
            im[:, :, 2] = (mask > 0) * 255 + (mask == 0) * im[:, :, 2]
            cv2.polylines(im, [np.int0(points).reshape((-1, 1, 2))], True, (0, 255, 0), 3)
            cv2.imshow('SiamMask', im)
            key = cv2.waitKey(1)
            if key > 0:
                break

        toc += cv2.getTickCount() - tic
    toc /= cv2.getTickFrequency()
    fps = f / toc
    print('SiamMask Time: {:02.1f}s Speed: {:3.1f}fps (with visulization!)'.format(toc, fps))
    
    # prepare for classification
    data_path = ''
    data_files = sorted(glob.glob(join(data_path, '*.jp*')))
    data = [cv2.imread(imf, cv2.IMREAD_GRAYSCALE) for imf in data_files]
    
    # prepare for model
    # becasue the limit of package of 'pickle', source code of the network architecture should be imported
    lenet = torch.load('net.pkl')   # invoke model named as 'net.pkl' denoted as lenet
    
    # prediction
    result = []
    transform = torchvision.transforms.ToTensor()
    
    for counter, frame in enumerate(data):
        tensor = transform(frame)
        ts = torch.unsqueeze(tensor, dim = 1)
        predict = lenet(ts) # predict for every frame of the video
        prediction_y = torch.max(predict, 1)[1].data.squeeze()
        result.append(prediction_y) # add result to the result set
    
    # save result (denote the code when you need to)
    #result_path = ''
    #file = open(result_path, 'w')
    #for item in result:
    #    file.wtireLine(str(item))
    #file.close()
    
    # show result
    print(result)