// pages/record/record.js
const wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var columnChart = null;
var chartData = {
  main: {
    title: 'TEST',
    data: [0, 0, 0, 0],
    categories: ['No ball', 'Passing', 'Shooting', 'Dribbling']
  }
};


Page({

  /**
   * Initialize the page
   */
  data: {
    chartTitle: 'Result',
    isMainChartDisplay: true,
    result: '',
    receive: "obtain predicted result",
    receive_button: "receiveTxt"

  },

  /**
   * continually inspecting the page
   */
  onLoad: function (options) {
  },

  /**
   * be called when page are loaded and ready
   */
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

  receiveResult: function(){
    var that = this;
    wx.showLoading({
      title: 'Please waiting..',
    });
    //request data
    wx.request({
      url: 'http://192.168.0.108:8000/result', //IP address
      header: {
        'content-type': 'application/xml' // dafault value
      },
      success: (res) => {
        wx.hideLoading();
        if(res.statusCode != 200){
          that.setData({
            receive: "you should do tracking procedures first",
            receive_button: "receiveFail",
          })
        }
        else{
          that.setData({
            result: res.data.subjects,
            receive: "received successfully",
            receive_button: "receiveSuccess",
          });
          console.log(chartData.main.data)
          res.data = res.data.split(",")
          for (var i = 0; i < 4; i++) {
            chartData.main.data[i] = parseInt(res.data[i])
          }
          console.log(chartData.main.data)
        }
        /**that.setData({
          result: res.data.subjects,
          receive: "received successfully",
          receive_button: "receiveSuccess",
        });
        console.log(chartData.main.data)
        res.data = res.data.split(",")
        for (var i = 0; i < 4; i++) {
          chartData.main.data[i] = parseInt(res.data[i])
        }
        console.log(chartData.main.data)**/
      },
      fail: function (res) {
        wx.hideLoading();
        that.setData({
          receive: "failed, please try again",
          receive_button: "receiveFail",
        })
        console.log("失败");
      }
    })
  },
  
  showResult: function () {

    this.setData({
      result: chartData.main.data
    })
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,

      series: [{
        name: 'times',
        color: 'lightcoral',
        data: this.data.result,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {                     //width
        column: {
          width: 15,
        },
        legendTextColor: '#000000'
      },
      width: 400,
      height: 200,
    });


    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: chartData.main.categories,
      series: [{
        name: 'times',
        color: 'lightcoral',
        data: this.data.result,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        title: 'times',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 400,
      height: 200,
    });
  
    var array = this.data.result;
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: 'No ball',
        data: array[0],
      }, {
        name: 'Passing',
        data: array[1],
      }, {
        name: 'Shooting',
        data: array[2],
      }, {
        name: 'Dribbling',
        data: array[3],
      }],
      width: 400,
      height: 200,
      dataLabel: false
    })

    new wxCharts({
      canvasId: 'ringCanvas',
      type: 'ring',
      series: [{
        name: 'No ball',
        data: array[0],
      }, {
        name: 'Passing',
        data: array[1],
      }, {
        name: 'Shooting',
        data: array[2],
      }, {
        name: 'Dribbling',
        data: array[3],
      }],
      width: 400,
      height: 200,
      dataLabel: false
    })
  },

})