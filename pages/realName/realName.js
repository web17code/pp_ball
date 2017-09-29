// pages/myInfo.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        mobile: "",
        buttonTxT: "获取验证码",
        buttonTime: 60,
        isCd: false,
        noteId: ""
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        clearInterval(app.globalData.mobileCodeInterval);
        if (app.globalData.bodyInfo == null) {
            if (app.globalData.wxId != "") {
                that.getbaseInfo();
            } else {
                app.showErrMsg("请求异常")
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 2
                    })
                }, 1700)
            }
        } else {
            //设置手机号
            this.data.mobile = app.globalData.bodyInfo.mobile;
            console.log(this.data.mobile)
            this.setData({
                info: {
                    "ppUserNickname": app.globalData.bodyInfo.nickname,
                    "ppUserSex": app.globalData.bodyInfo.sex + '',
                    "ppUserAge": app.globalData.bodyInfo.age,
                    "ppUserStature": app.globalData.bodyInfo.stature,
                    "ppUserWeight": app.globalData.bodyInfo.weight,
                    "userName": app.globalData.bodyInfo.userName,//新加的真实姓名
                    "mobile": app.globalData.bodyInfo.mobile,//新加手机号
                    "mobileCode": ""//手机验证码设置为空
                }
            })
        }
    },
    getbaseInfo: function () {
        console.log("getbaseInfo")
        var that = this;
        //微信登录,并提交js_code获取openid,以及身高体重
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        //发起网络请求
        wx.request({
            url: 'https://mapp.zhunedu.com/user/findUser',
            method: "POST",
            data: {
                token: "AG9S1538F9Z1G6Y9Q2T169",
                wxId: app.globalData.wxId
            },
            header: {'content-type': 'application/x-www-form-urlencoded'},
            success: function (res) {
                if (res.data.code == "20000") {
                    app.globalData.bodyInfo = res.data.entity;
                    //设置手机号
                    that.data.mobile = app.globalData.bodyInfo.mobile;
                    that.setData({
                        info: {
                            "ppUserNickname": app.globalData.bodyInfo.nickname,
                            "ppUserSex": app.globalData.bodyInfo.sex + '',
                            "ppUserAge": app.globalData.bodyInfo.age,
                            "ppUserStature": app.globalData.bodyInfo.stature,
                            "ppUserWeight": app.globalData.bodyInfo.weight,
                            "userName": app.globalData.bodyInfo.userName,//新加的真实姓名
                            "mobile": app.globalData.bodyInfo.mobile,//新加手机号
                            "mobileCode": ""//手机验证码设置为空
                        }
                    })
                    wx.hideLoading();
                }
            }
        })
    },
    /**
     * 更换验证码
     */
    //更换图片验证码[弃用]
    changeValidImg: function () {
        this.setData({
            urlValidImg: "https://mapp.zhunedu.com/ran/random?r=" + Math.random()
        })
    },
    //设置手机号
    bindInputMobile: function (e) {
        this.data.mobile = e.detail.value;
    },
    /*//设置图片验证码的值
     bindInputImgCode:function(e){
     console.log(e.detail.value)
     this.data.ImgCode = e.detail.value;
     },*/
    //获取手机验证码
    getMobileCode: function () {
        console.log(this.data.isCd)
        var that = this;
        //手机号符合规则
        if (this.data.mobile == "") {
            app.showErrMsg("手机号为空");
            return false;
        }
        if (!/^1[34578]\d{9}$/.test(this.data.mobile)) {
            app.showErrMsg("手机号非法");
            return false;
        }
        if (that.data.isCd == true) {
            return false;
        }
        that.data.isCd = true;
        wx.request({
            url: 'https://mapp.zhunedu.com/user/sendMobileNote',
            data: {wxId: app.globalData.wxId, mobile: that.data.mobile},
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res)
                that.data.noteId = res.data.entity;
                if (res.data.code == "20000") {
                    app.globalData.mobileCodeInterval = setInterval(function () {
                        that.data.buttonTime--;
                        that.setData({
                            buttonTxT: that.data.buttonTime + "s后获取"
                        })
                        if (that.data.buttonTime <= 0) {
                            that.data.buttonTime = 60;
                            that.data.isCd = false;
                            that.setData({
                                buttonTxT: "获取验证码"
                            })
                            clearInterval(app.globalData.mobileCodeInterval);
                        }
                    }, 1000)
                    wx.showToast({
                        title: '短信已发送',
                        icon: 'success',
                        duration: 1000,
                        mask: true
                    })
                } else if (res.data.code == "50000" && res.data.entity == "4085") {
                    that.data.isCd = false;
                    app.showErrMsg("条数超过上限")
                }else if (res.data.code == "50000") {
                    that.data.isCd = false;
                    app.showErrMsg("短信发送失败")
                } else{
                    that.data.isCd = false;
                }
            }
        })
    },
    /**
     * 提交个人信息
     */
    formSubmit: function (e) {
        console.log(e.detail.value)
        var that = this;
        //表单验空
        for (var key in e.detail.value) {
            if (e.detail.value[key].trim() == "") {
                app.showErrMsg("请填写完整表单");
                return false;
            }
        }
        if (!/^1[34578]\d{9}$/.test(this.data.mobile)) {
            app.showErrMsg("手机号非法");
            return false;
        }
        //e.detail.value["ppUser.userId"] = app.globalData.userId;
        e.detail.value["wxId"] = app.globalData.wxId;
        e.detail.value["token"] = "AG9S1538F9Z1G6Y9Q2T169";
        e.detail.value["noteId"] = that.data.noteId;
        //发送请求
        wx.showLoading({
            title: '保存中',
            mask: true
        })
        wx.request({
            url: 'https://mapp.zhunedu.com/user/modifyUserMobile',
            data: e.detail.value,
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '实名成功',
                        icon: 'success',
                        duration: 1000,
                        mask: true
                    })
                    //app.globalData.isPlaying = true;
                    setTimeout(function () {
                        that.getbaseInfo();
                    }, 1000)
                } else {
                    wx.hideLoading()
                    app.showErrMsg("保存失败");
                }
            }
        })
        setTimeout(function () {
            wx.hideLoading()
        }, 8000)
    }
})