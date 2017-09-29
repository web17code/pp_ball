var app = getApp();
Page({
    data: {},
    onShow: function () {
      console.log(app.globalData.userLevel)
        var that = this;
        //设置用户公开信息
        if (app.globalData.userInfo == null) {
            that.setData({
                userInfo: {
                    avatarUrl: "../../image/wx_avatar.png",
                    nickName: "神秘游客"
                }
            })
        } else {
            that.setData({
                userInfo: app.globalData.userInfo,
                userLevel: app.globalData.userLevel
            })
        }
        console.log(that.data.userLevel)
    },
    setting: function () {
        wx.openSetting({})
    },
    goRecord: function () {
        wx.navigateTo({
            url: '/pages/myRecord/myRecord'
        })
    },
    goRank: function () {
        wx.navigateTo({
            url: '/pages/rank/rank'
        })
    },
    goMyInfo: function () {
        wx.navigateTo({
            url: '/pages/myInfo/myInfo'
        })
    },
    goRealName:function(){
        wx.navigateTo({
            url: '/pages/realName/realName'
        })
    },
    onShareAppMessage: function (res) {
        console.log(res)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '跟我一起加入吧',
            path: 'pages/index/index',
            success: function (res) {
                // 转发成功
                //console.log("zhuanfa")
            },
            fail: function (res) {
                // 转发失败
                //console.log("shibaile")
            }
        }
    }
})