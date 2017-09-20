//myRecord.js
var app = getApp();
Page({
    data: {
        pageNumber: 1,
        ranks: app.globalData.rank,
        myRank:{},
        hasMoreTxt:"拉取更多排名",
        hasMore:true
    },
    onShow: function () {
        /*时间格式化start*/
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        /*时间格式化end*/
        var that = this;
        if (app.globalData.rank.length == 0) {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            that.getRankList();
            var interval = setInterval(function () {
                if (app.globalData.rank.length != 0) {
                    wx.hideLoading();
                    that.setData({
                        ranks: app.globalData.rank
                    })
                    clearInterval(interval);
                }
            }, 100)
        }
        that.getMyRank();
        var that = this;
        //设置用户公开信息
        if (app.globalData.userInfo == null) {
            that.setData({
                userInfo: {
                    avatarUrl: "../../image/wx_avatar.png",
                    nickName: "我"
                }
            })
        } else {
            that.setData({
                userInfo: app.globalData.userInfo
            })
        }
    },
    //页面触底是的事件
    onReachBottom: function (e) {
        this.getMore();
    },
    //页面滚动时的事件
    // onPageScroll: function (e) {
    //   console.log(e);
    // }
    getRankList: function () {
        var that = this;
        var pageNumber = 1;
        if(app.globalData.rank.length!=0){
            pageNumber = parseInt(app.globalData.rank.length/10)+1;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        //发起网络请求
        wx.request({
            url: 'https://mapp.zhunedu.com/ppRanking/queryRanking',
            method: "POST",
            data: {
                pageNumber:pageNumber,
                pageSize: 10,
                date: new Date(new Date().getTime()-24*60*60*1000).Format("yyyy-MM-dd"),
                token: "AG9S1538F9Z1G6Y9Q2T169"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                //app.globalData.rank = res.data.entity.rankingDatas;
                if(res.data.code=="20000"){
                    wx.hideLoading();
                }
                for(var i=0;i<res.data.entity.rankingDatas.length; i++){
                     app.globalData.rank.push(res.data.entity.rankingDatas[i])
                }
                that.setData({
                    ranks:app.globalData.rank
                })
                if(res.data.entity.rankingDatas.length<2){
                    that.setData({
                        "hasMoreTxt":"我就是底线，别拉了",
                        "hasMore":false
                    })
                }else if(res.data.entity.rankingDatas.length>=2){
                    that.setData({
                        "hasMore":"拉取更多排名",
                        "hasMore":true
                    })
                }
            }
        })
    },
    //获取个人排名
    getMyRank:function(){
        var that = this;
        wx.request({
            url: 'https://mapp.zhunedu.com/ppRanking/queryMyRanking',
            method: "POST",
            data: {
                wxId:app.globalData.wxId,//
                date:new Date(new Date().getTime()-24*60*60*1000).Format("yyyy-MM-dd"),
                token: "AG9S1538F9Z1G6Y9Q2T169"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                that.setData({
                    myRank:res.data.entity
                })
            }
        })
     },
    getMore:function(){
        if(!this.data.hasMore){
            return false;
        }
        this.getRankList();
    }
})
