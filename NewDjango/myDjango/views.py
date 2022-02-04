from django.shortcuts import render
from django.http import HttpResponse
from .form import UploadFileForm
from django.views.decorators.csrf import csrf_exempt
from NewDjango import settings
import sys
#change the path next line to be the location of the start function
sys.path.append(r'C:\Users\超级卢本伟\Desktop\大三课本\NewDjango\SiamMask')
#import (the .py file which contains the start function)

def handle_uploaded_file(f, filename):
    filename_path: str = f'{settings.MEDIA_ROOT}{filename}'  # 生成文件名及路径
    with open(filename_path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
        destination.close()
        return HttpResponse('file for upload ok')


@csrf_exempt
def index(request):
    #this is the function called when a video is received from the front end
    if request.method == 'POST':
        forms = UploadFileForm(request.POST, request.FILES)
        handle_uploaded_file(request.FILES['file'], request.FILES.get('file'))
        print('received!')
        if forms.is_valid():
            print("a " + request.method + " request occurs!")
            handle_uploaded_file(request.FILES['file'], filename=request.FILES.get('file'))
            return HttpResponse('file for upload ok')

    #this is the function called when the front end requires data to draw the graphs
    if request.method == 'GET':
        #call the start function here, set res equals to the return result
        res = '1, 2, 3, 4'
        return HttpResponse(res)
    else:
        print("a " + request.method + " request occurs!")
        return HttpResponse('Wrong Method!')
    return HttpResponse('file for upload ok')