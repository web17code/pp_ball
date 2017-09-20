//logs.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
    data: {
        now_index: 25//用户的选择的局数，默认25
    },
    onShow: function () {
        console.log(app.globalData.userInfo)
        app.getLocation();
        app.getWxId();
    },
    //点击选中局数的事件
    getPlayNum: function (e) {
        this.setData({now_index: parseInt(e.currentTarget.dataset.value)})
    },
    //提交函数，有校验和错误提示
    formSubmit: function () {
        var playNum = this.data.now_index;//选择的局数
        //var playNum = parseInt(e.detail.value.playNum);
        // if(!(/^\+?[1-9][0-9]*$/.test(e.detail.value.playNum))){//不是正整数就跳出
        //     //数字不合法
        //     app.showErrMsg("局数应该为正整数哦");
        //     return false;
        // }
        if (app.globalData.locationInfo == null) {//地理位置为空跳出 
            app.showErrMsg("获取地理位置异常,请查看设置");
            return false;
        }
        var sendData = {
            "playNum": playNum,//玩的局数
            "location": app.globalData.locationInfo,//地理位置信息
            "userInfo": "怎么就炸了"//用户ID信息
        }
        /*wx.showLoading({
            title: '通知云端开启中',
        })*/
        // wx.showToast({
        //   title: '已递交您的请求',
        //   icon: 'success',
        //   duration: 1000,
        //   mask: true
        // })
        //发送请求
        wx.showLoading({
          title: '通知云端开启中',
          mask: true
        })
        app.globalData.isPlaying = true;
        // console.log(app.globalData.isPlaying)
        //             setTimeout(function () {
        //               wx.navigateTo({//跳转到首页
        //                 url: '../index/index'
        //               })
        //             }, 2000)
        
        wx.request({
            url: 'https://mapp.zhunedu.com/tasks/createPpTasks',
            data: {
                "ppTasks.ppId": app.globalData.qr,
                "ppTasks.wxId": app.globalData.wxId,
                "ppTasks.ppNumber": playNum,
                "portraitImg":app.globalData.userInfo.avatarUrl,
                "nickname":app.globalData.userInfo.nickName,
                "token": "AG9S1538F9Z1G6Y9Q2T169",
                "location": app.globalData.locationInfo.longitude + ',' + app.globalData.locationInfo.latitude,//地理位置信息
            },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.success) {
                    wx.showToast({
                      title: '云端成功处理请求',
                      icon: 'success',
                      duration: 1500,
                      mask: true
                    })
                    //app.globalData.isPlaying = true;
                    setTimeout(function () {
                      wx.navigateBack({
                          delta: 1
                      })
                    }, 1700)
                }else if(res.data.code=="40321"){
                    wx.showModal({
                        title: '关闭乒乓机',
                        content: '乒乓机正在运行，您确定要关闭吗？',
                        success: function(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: 'https://mapp.zhunedu.com/tasks/createOverPpTasks',
                                    data: {
                                        "ppTasks.ppId": app.globalData.qr,
                                        "ppTasks.wxId": app.globalData.wxId,
                                        "token": "AG9S1538F9Z1G6Y9Q2T169",
                                        "location": app.globalData.locationInfo.longitude + ',' + app.globalData.locationInfo.latitude,//地理位置信息
                                    },
                                    method: "POST",
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    success: function (res) {
                                        if(res.data.code=="20000"||res.data.code=="40321"){
                                            wx.showToast({
                                                title: '已添加关机任务,请稍后重试',
                                                icon: 'success',
                                                duration: 1000,
                                                mask: true
                                            })
                                            app.globalData.isPlaying = false;
                                            setTimeout(function () {
                                                wx.navigateBack({
                                                    delta: 1
                                                })
                                            }, 1300)
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                console.log('不关闭机器')
                            }
                        }
                    })
                }else{
                    app.showErrMsg("机器异常，换一台试试");
                }

            }
        })
        //5s后关闭加载框
        setTimeout(function () {
          wx.hideLoading()
        }, 5000)
    },
    //获取权限函数
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
