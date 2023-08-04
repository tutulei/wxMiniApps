// pages/myPage/my.js

const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        title:"我的",
        inputDlghidden:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("page my load")
        // console.log(app.globalData.userInfo)
        this.setData({
            userInfo:app.globalData.userInfo,
            realName:app.globalData.realName,
            invitationCode:"",
        })
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
        console.log("page my show")
        this.setData({
            nbTitle: this.data.title,
            nbFrontColor: app.globalData.nbFrontColor,
            nbBackgroundColor: app.globalData.nbBackgroundColor,
          })
          this.initInvestorData()
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

    initInvestorData:function(){
        let data = app.globalData.investorInfoData
        let code = data["authorizeCode"]
        if(code === undefined){
            code = "未指定"
        }
        // console.log(data)
        this.setData({
            isMaster:data["master"],
            realName:data["realName"],
            fundId:data["fundAcc"],
            invitationCode:code,
        })
    },
    exitPage:function(){
        wx.request({
            url: app.globalData.serviceUrl + '/wx/exit',
            data: {
                login_id: app.globalData.loginId,
            },
            success(res){
                app.globalData.loginId = ''
                wx.showToast({
                  title: '退出成功',
                  icon:'none',
                })
            }
        })
        wx.redirectTo({
            url: '/pages/login/login',
        })
    },
    queryMyMsg:function(){
        let str_tail = "/wx/myMsg"
        let that = this
        console.log("queryMyMsg")
        wx.request({
          url: app.globalData.serviceUrl+str_tail,
          data: {
            login_id: app.globalData.loginId,
          },
          success(res){
            let data = res.data
            app.globalData.investorInfoData = data
            that.initInvestorData()
          }
        })
    },
    modifyClick:function(){
        this.data.inputDlghidden = false
        this.setData({
            inputDlghidden:this.data.inputDlghidden,
            dlgAuthorizeCode:this.data.invitationCode,
        })
    },
    /***
     * 弹窗关闭
     */
    hiddenInputDlg:function(e){
        // console.log(e.detail.isConfirm)
        this.data.hiddenInputDlg = true
        this.setData({
            inputDlghidden:this.data.hiddenInputDlg
        })
        if(e.detail.isConfirm){
            this.queryMyMsg()
        }
    },

})