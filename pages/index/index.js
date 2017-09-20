// //index.js
var app = getApp();
var interval_1 = null;
var interval_wxId = null;
Page({
    data: {
        "isPlaying": app.globalData.isPlaying,
        "sending":false
    },
    //加载获取用户信息
    onShow: function () {
        var that = this;
        that.setData({
            isPlaying: app.globalData.isPlaying
        })
        //获取wxId
        app.getWxId();
        //获取用户公开数据
        app.getUserInfo(function (userInfo) {//这里是获取到用户信息的回调函数
        });
        that.getMachineState();
        //查看机器状态
        interval_wxId = setInterval(function () {
            if(app.globalData.wxId!=""){//获取到wxId则开始查看机器状态
                that.getMachineState();
                clearInterval(interval_wxId);
            }
        },150)
        //console.log(this.data.userInfo);
    },
    //扫码开启
    openMachine: function () {
        var that = this;
        //获取用户公开数据
        if (app.globalData.userInfo == null) {//为空，根据权限走分支
            wx.getSetting({
                success: function (res) {
                    console.log(res)
                    if (res.authSetting['scope.userInfo']) {//有权限，获取用户头像昵称信息
                        //获取用户公开数据
                        app.getUserInfo(function (userInfo) {
                            wx.scanCode({
                                success: function (res) {
                                    //将扫码内容放到全局区
                                    app.globalData.qr = res.result;
                                    //销毁定时器
                                    clearInterval(interval_wxId);
                                    clearInterval(interval_1);
                                    //跳转到开器的页面
                                    wx.navigateTo({
                                        url: '/pages/openMachine/openMachine'
                                    })
                                }
                            })
                        });
                    } else {//没有权限，引导打开权限
                        wx.showToast({
                            title: '请授权后再试',
                            image: "/image/error_w.svg",
                            duration: 1000,
                            mask: true
                        })
                        setTimeout(function () {
                            wx.openSetting({})
                        }, 1100)
                    }
                }
            })
        } else {
            wx.scanCode({
                success: function (res) {
                    //将扫码内容放到全局区
                    app.globalData.qr = res.result;
                    //跳转到开器的页面
                    wx.navigateTo({
                        url: '/pages/openMachine/openMachine'
                    })
                }
            })
        }
    },
    //跳转到个人信息页面
    goUserInfo: function () {
        wx.navigateTo({
            url: '/pages/userInfo/userInfo'
        })
        clearInterval(interval_wxId);
        clearInterval(interval_1);
    },
    //关闭
    closeMachine:function(){
        var that = this;
        wx.showModal({
            title: '关闭乒乓机',
            content: '确定要关闭您的乒乓机吗？',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: 'https://mapp.zhunedu.com/tasks/createOverPpTasks',
                        data: {
                            "ppTasks.ppId": app.globalData.qr,
                            "ppTasks.wxId": app.globalData.wxId,
                            "token": "AG9S1538F9Z1G6Y9Q2T169"
                        },
                        method: "POST",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            if(res.data.code=="20000"||res.data.code=="40321"){
                                wx.showToast({
                                    title: '已发出关机请求',
                                    icon: 'success',
                                    duration: 2000,
                                    mask: true
                                })
                                that.getMachineState();

                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('不关闭机器')
                }
            }
        })
    },
    //获取机器状态
    getMachineState: function () {
        var that = this;
        //已经在发送
        if (that.sending) {
            return false;
        }
        var that = this;
        that.sending = true;
        interval_1 = setInterval(function () {
            wx.request({
                url: 'https://mapp.zhunedu.com/tasks/findPpTasksByWxId',
                data: {
                    "wxId": app.globalData.wxId,
                    "token": "AG9S1538F9Z1G6Y9Q2T169",
                },
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    console.log("请求findPpTasksByWxId",res)
                    if (res.data.code == "40322") {//空闲则停止
                        console.log("内部请求findPpTasksByWxId",res)
                        app.globalData.isPlaying = false;//修改全局的玩游戏的状态
                        that.setData({
                            isPlaying:false//刷新页面
                        })
                        that.sending = false;
                        clearInterval(interval_1);
                    } else {//非空闲继续
                        app.globalData.isPlaying = true;
                        that.setData({
                            isPlaying:true//刷新页面
                        })
                    }
                }
            })
        }, 2000)
    }
})