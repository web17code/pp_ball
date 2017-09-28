// pages/myInfo.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        urlValidImg:"https://mapp.zhunedu.com/ran/random",
        filled: false,
        info: {},
        ImgCode:"",
        mobile:""
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        if (app.globalData.bodyInfo == null) {
            if(app.globalData.wxId!=""){
                that.getbaseInfo();
            }else{
                app.showErrMsg("请求异常")
                // setTimeout(function () {
                //     wx.navigateBack({
                //         delta: 2
                //     })
                // }, 1700)
            }
        } else {
            this.data.mobile = app.globalData.bodyInfo.mobile;
            this.setData({
                info: {
                    "ppUserNickname": app.globalData.bodyInfo.nickname,
                    "ppUserSex": app.globalData.bodyInfo.sex + '',
                    "ppUserAge": app.globalData.bodyInfo.age,
                    "ppUserStature": app.globalData.bodyInfo.stature,
                    "ppUserWeight": app.globalData.bodyInfo.weight,
                    "mobile": app.globalData.bodyInfo.mobile
                }
            })
            console.log(":"+this.data.mobile)
        }

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
    getbaseInfo: function () {
        var that = this;
        //app.globalData.hasWxIdRespone = false;
        //先安全监测后赋值
        //微信登录,并提交js_code获取openid,以及身高体重
        // wx.showLoading({
        //     title: '加载中',
        //     mask: true
        // })
        //发起网络请求
        wx.request({
            url: 'https://mapp.zhunedu.com/user/findUser',
                        method: "POST",
                        data: {
                            token: "AG9S1538F9Z1G6Y9Q2T169",
                            wxId:app.globalData.wxId
                        },
            header: {'content-type': 'application/x-www-form-urlencoded'},
            success: function (res) {
                if(res.data.code=="20000"){
                    app.globalData.bodyInfo = res.data.entity;
                    //console.log(app.globalData.bodyInfo)
                    that.setData({
                        info: {
                            "ppUserNickname": app.globalData.bodyInfo.nickname,
                            "ppUserSex": app.globalData.bodyInfo.sex + '',
                            "ppUserAge": app.globalData.bodyInfo.age,
                            "ppUserStature": app.globalData.bodyInfo.stature,
                            "ppUserWeight": app.globalData.bodyInfo.weight,
                            "userName":app.globalData.bodyInfo.userName,//新加的真实姓名
                            "mobile":app.globalData.bodyInfo.mobile,//新加手机号
                            "mobileCode":""//手机验证码设置为空
                        }
                    })
                    wx.hideLoading();
                }
                //app.globalData.bodyInfo = res.data.entity.user;
                //app.globalData.wxId = res.data.entity.openid;
                //app.globalData.hasWxIdRespone = true;
            }
        })
        //请求得到，更新视图，清除loading
        /*var interval = setInterval(function () {
            if (app.globalData.hasWxIdRespone) {

                clearInterval(interval);
            }
        }, 100)*/
    },
    /**
     * 更换验证码
     */
    //更换图片验证码
    changeValidImg:function(){
        this.setData({
            urlValidImg:"https://mapp.zhunedu.com/ran/random?r="+Math.random()
        })
    },
    //设置手机号
    bindInputMobile:function(e){
        console.log(e.detail.value);
        this.data.mobile = e.detail.value;
    },
    //设置图片验证码的值
    bindInputImgCode:function(e){
        console.log(e.detail.value)
        this.data.ImgCode = e.detail.value;
    },
    //获取手机验证码
    getMobileCode:function(){
        var that = this;
        //手机号符合规则
        if(this.data.mobile==""){
            app.showErrMsg("手机号为空");
            return false;
        }
        if(!/^1[34578]\d{9}$/.test(this.data.mobile)){
            app.showErrMsg("手机号非法");
            return false;
        }
        //校验图片验证码不为空
        if(this.data.ImgCode==""){
            app.showErrMsg("图片验证码为空");
            return false;
        }
            wx.request({
                url: 'https://mapp.zhunedu.com/user/sendMobileNote',
                data: {randomCode: that.data.ImgCode, mobile: that.data.mobile},
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    console.log(res)
                }
            })
    },
    /**
     * 提交个人信息
     */
    formSubmit: function (e) {
        console.log(e.detail.value)
        var that = this;
        for (var key in e.detail.value) {
            if (e.detail.value[key].trim() == "") {
                app.showErrMsg("请填写完整表单");
                return false;
            }
        }
        e.detail.value["ppUser.userId"] = app.globalData.userId;
        e.detail.value["ppUser.wxId"] = app.globalData.wxId;
        e.detail.value["ppUser.portraitImg"] = "";
        e.detail.value["token"] = "AG9S1538F9Z1G6Y9Q2T169";
        //发送请求
        wx.showLoading({
            title: '保存中',
            mask: true
        })
        wx.request({
            url: 'https://mapp.zhunedu.com/user/modifyUser',
            data: e.detail.value,
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '保存成功',
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
/*        if (app.globalData.bodyInfo == null) {
 app.getWxId(function (x) {
 });
 wx.showLoading({
 title: '加载中',
 mask: true
 })
 setTimeout(function () {
 wx.hideLoading()
 }, 1000)
 that.setData({
 info: {
 "ppUserNickname": app.globalData.bodyInfo.nickname,
 "ppUserSex": app.globalData.bodyInfo.sex,
 "ppUserAge": app.globalData.bodyInfo.age,
 "ppUserStature": app.globalData.bodyInfo.stature,
 "ppUserWeight": app.globalData.bodyInfo.weight
 }
 })
 }*/