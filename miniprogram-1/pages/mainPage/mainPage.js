// pages/mainPage/mainPage.js
Page({

  /**
   * Initialize the page
   */
  data: {
    tracking_button: "Start tracking",
    isDisabled: false,
    src: '',
    x: 0,
    y: 0
  },


  onLoad: function (options) {

  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  },

  upload: function () {
    wx.navigateTo({
      url: '../mainPage/mainPage'
    })
  },

  record: function () {
    wx.navigateTo({
      url: '../record/record'
    })
  },

  me: function () {
    wx.navigateTo({
      url: '../me/me'
    })
  },


  trackSet: function () {
    wx.navigateTo({
      url: '../trackSet/trackSet'
    })
  },


  addVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          data: res,
          src: res.tempFilePath,
          size: (res.size / (1024 * 1024)).toFixed(2)
        })
        console.log(res.tempFilePath)
        wx.uploadFile({
          url: 'http://192.168.0.108:8000/',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (src) {
            console.log('UPLOAD SUCCESS!')
            that.setData({
              tracking_button: "Start stracking",
              isDisabled: false
            })
          },
          fail: function (res) {
            console.log('fail to upload video')
            console.log(res.tempFilePath)
          },
        })
      }
    })
  },


  onChange(e) {
    console.log(e.detail);
    this.setData({
      x: e.detail.x,
      y: e.detail.y
    })
  },

  onScale(e) {
    console.log(e.detail)
  },

  queryMultipleNodes: function () {

    var query = wx.createSelectorQuery()
    query.select('#trackTarget').boundingClientRect()
    query.selectViewport().scrollOffset()

    query.exec(function (res) {
      res[0].top
      res[1].scrollTop
    })

  },

  uploadCoord: function () {
    var query = wx.createSelectorQuery();
    var that = this;
    wx.showLoading({
      title: 'On process..',
    });
    that.setData({
      isDisabled: true,
      tracking_button: "on process"
    })
    query.select('#trackTarget').boundingClientRect(function (rect) {
      var h = Math.round(rect.height)
      var w = Math.round(rect.width)
      var t = Math.round(that.data.y)
      var l = Math.round(that.data.x)
      console.log(h, w, t, l, "aaaaaaaaaaaaaa")
      //console.log(rect.width)
      that.setData({
        height: h,
        width: w,
        top: t,
        left: l

      })
      wx.request({
        url: 'http://192.168.0.108:8000/index/', //local IP address
        data: {
          top: that.data.top,
          left: that.data.left,
          height: that.data.height,
          width: that.data.width
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' //default value
        },
        success: function (res) {
          console.log(res);
          wx.downloadFile({
            url: 'http://192.168.0.108:8000/download',
            type: 'video',
            //filePath: 'C:\Users\zf\Desktop',
            success: function (res) {
              wx.hideLoading();
              that.setData({
                tracking_button: "succeed",
                data: res,
                src: res.tempFilePath,
                //size: (res.size / (1024 * 1024)).toFixed(2)
              })
            },
            fail: function (res) {
              wx.hideLoading();
              that.setData({
                tracking_button: "tracking failed"
              })
              console.log("failed to obtain processed video")
            }
          })
        },
        fail: function (res) {
          wx.hideLoading();
          that.setData({
            tracking_button: "tracking failed"
          })
          console.log("失败");
        }
      })
    }).exec();
  },

  help: function(){
    wx.showModal({
      title: 'Guide',
      content: '1. click the first button to upload your football video;\r\n2. move the rectangle(on the top left corner) to enclose your target;\r\n3. click the second button to start tracking.',
      confirmText: 'OK',
      cancelText:'Cancel',
    })
  }
})