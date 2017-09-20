//myRecord.js
var app = getApp();
Page({
    data: {
        showKong:false,
        records: app.globalData.myRecord
    },
    onShow: function () {
        var that = this;
        //发起网络请求
        wx.request({
            url: 'https://mapp.zhunedu.com/ppGameScore/findGameScoreListByWxId',
            method: "POST",
            data: {
                wxId: app.globalData.wxId,//"QZA123664",//
                token: "AG9S1538F9Z1G6Y9Q2T169"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if(res.data.entity.length!=0){//空数据显示
                that.setData({
                  showKong: false
                })
                that.setData({
                  records: res.data.entity
                })
                app.globalData.myRecord = res.data.entity;
              }else{
                that.setData({
                  showKong: true
                })
              }  
            }
        })
    }
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(function (log) {
    //     return util.formatTime(new Date(log))
    //   })
    // })
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
