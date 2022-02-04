// pages/record/record.js
const wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var columnChart = null;
var chartData = {
  main: {
    title: 'TEST',
    data: [0, 0, 0, 0],
    categories: ['action1', 'action2', 'action3', 'action4']
  }
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartTitle: 'Result',
    isMainChartDisplay: true,
    result: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: 'Please waiting..',
    });
    //请求数据
    wx.request({
      url: 'http://192.168.0.108:8000/result', //地址
      header: {
        'content-type': 'application/xml' // 默认值
      },
      success: (res) => {
        wx.hideLoading();
        this.setData({
          result: res.data.subjects,
        });
        console.log(chartData.main.data)        
        res.data = res.data.split(",")
        for(var i = 0; i < 4; i++){
          chartData.main.data[i] = parseInt(res.data[i])
        }
        console.log(chartData.main.data)
      },
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
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


  show1: function () {
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
  },

  show2: function () {
    var array = this.data.result;
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: 'action1',
        data: array[0],
      }, {
        name: 'action2',
        data: array[1],
      }, {
        name: 'action3',
        data: array[2],
      }, {
        name: 'action4',
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
        name: 'action1',
        data: array[0],
      }, {
        name: 'action2',
        data: array[1],
      }, {
        name: 'action3',
        data: array[2],
      }, {
        name: 'action4',
        data: array[3],
      }],
      width: 400,
      height: 200,
      dataLabel: false
    })


    /*var context = wx.createContext();
    // 画饼图
    //    数据源
    var array = chartData.main.data;
    var colors = ["lightgoldenrodyellow", "lightcoral", "lightpink", "lightsalmon"];
    var total = 0;
    //    计算总量
    for (var index = 0; index < array.length; index++) {
      total += array[index];
    }
    //    定义圆心坐标
    var point = { x: 100, y: 100 };
    //    定义半径大小
    var radius = 60;

    for (var i = 0; i < array.length; i++) {
      context.beginPath();
      //    	起点弧度
      var start = 0;
      if (i > 0) {
        // 计算开始弧度是前几项的总和，即从之前的基础的上继续作画
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }
      console.log("i:" + i);
      console.log("start:" + start);
      //      1.先做第一个pie
      //   	2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针
      context.arc(point.x, point.y, radius, start, start+array[i] / total * 2 * Math.PI, false);
      //      3.连线回圆心
      context.lineTo(point.x, point.y);
      //      4.填充样式
      context.setFillStyle(colors[i]);
      //      5.填充动作
      context.fill();
      context.closePath();
    }
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    wx.drawCanvas({
      //指定canvasId,canvas 组件的唯一标识符
      canvasId: 'pieCanvas',
      actions: context.getActions()
    });*/
  },






})