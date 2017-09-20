//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '发的什么鬼',
      path: '/page/user?id=123'
    }
  }
  //页面触底是的事件
  // onReachBottom:function(e){
  //   console.log(e)
  // },
  //页面滚动时的事件
  // onPageScroll: function (e) {
  //   console.log(e);
  // }
  //this.route//当前的路由
})
