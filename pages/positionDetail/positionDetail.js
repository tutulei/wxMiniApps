// pages/positionDetail/positionDetail.js

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        agName:'测试1号',
        agCode:'123456',
        holdValue:123456.12,
        priceValue:123456.12,
        nvValue:1.001,
        seller:'管理人直销',
        agNo:0,
        list:[],
        ////
        refreshSrc:'/resource/ico/refresh.png',
        holdLabel:'持有份额',
        priceLabel:'参考市值(元)',
        nvLabel:'最新净值',
        sellerLabel:'销售商',
        listName:'持仓明细',
        buttonStr:'返回',
        shareLabel:'持有份额',
        holdnavLabel:'净值',
        str_tail:'/wx/queryPositionDetail',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = options.data
        console.log(data)
        this.initData(data)
        this.queryList()
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
    queryList:function(){
        let that = this
        wx.showLoading({
          title: '查询中...',
        })
        wx.request({
            url: app.globalData.serviceUrl+that.data.str_tail,
            data: {
                login_id: app.globalData.loginId,
                seller: that.data.seller,
                ag_no:that.data.agNo,
            },
            success(res){
                let data = res['data']
                that.data.list = data
                that.setData({
                    positionDetailList: that.data.list
                })
                wx.hideLoading()
            }
        })
    },
    initData:function(data){
        let that = this
        data = JSON.parse(data)
        that.data.agName = data['agName']
        that.data.agCode = data['agCode']
        that.data.holdValue = data['share']
        that.data.priceValue = data['shareValue']
        that.data.nvValue = data['nv']
        ////
        that.data.agNo = data['agNo']
        that.data.seller = data['seller']
        this.setData({
            agName:that.data.agName,
            agCode:that.data.agCode,
            holdValue:that.data.holdValue,
            priceValue:that.data.priceValue,
            nvValue:that.data.nvValue,
        })
    },
    refreshList:function(){
        this.queryList();

    },
    comeBack:function(){
        wx.navigateBack({
          delta: 0,
        })
    }
})