//app.js
//import wxValidate from 'utils/wxValidate'
App({
    //表单校验
    //wxValidate: (rules, messages) => new wxValidate(rules, messages),
    //获取用户信息
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用wx获取用户信息API
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },
    //获取openid，并获取用户状态和用户身体信息【其实获取用户状态的函数应该提出来】
    getWxId: function () {
        var that = this;
        if(that.globalData.wxId!=""){
            return false;
        }
        //微信登录,并提交js_code获取openid
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://mapp.zhunedu.com/user/getUserWxInfo',
                        method: "POST",
                        data: {
                            jsCode: res.code,
                            token: "AG9S1538F9Z1G6Y9Q2T169"
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            that.globalData.wxId = res.data.entity.openid;
                            that.globalData.userId = res.data.entity.user.userId;
                        }
                    })
                }
            }
        })
    },
    //获取地理位置权限
    getAuthorize_location: function () {
        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: function () {
                        }// 用户已经同意小程序使用定位功能
                    })
                }
            }
        })
    },
    //获取地理位置
    getLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                that.globalData.locationInfo = res;
            }
        })
    },
    //信息提示的函数
    showErrMsg: function (msg) {
        wx.showToast({
            title: msg,
            image: "/image/error_w.svg",
            duration: 1500,
            mask: true
        })
    },
    globalData: {
        wxId: '',
        userId:"",
        isPlaying: false,
        userInfo: null,
        bodyInfo: null,
        qr: null,
        locationInfo: null,
        myRecord: [],
        rank:[],//{},{},{},{},{},{},{},{},{},{}
    }
})
/*请求
 wx.request({
 url: 'https://op.juhe.cn/onebox/weather/query', //仅为示例，并非真实的接口地址
 data:res,
 header: {
 'content-type': 'application/json'
 },
 success: function (res) {
 console.log(res.data)
 }
 })*/
/*
 // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
 wx.getSetting({
 success(res) {
 if (!res.authSetting['scope.record']) {
 wx.authorize({
 scope: 'scope.record',
 success() {
 // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
 wx.startRecord()
 }
 })
 }
 }
 })
 hasWxIdRespone
 * */