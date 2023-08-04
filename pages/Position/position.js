// pages/Position/position.js
const app = getApp()

Page({

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('进入position')
        this.queryPositionList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
       
    },
    /***
     * 更新名字（login界面请求成功后调用）
     */
    onNameRefresh:function(name){
        this.setData({
            realName:name,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("page position show")
        this.setData({
            nbTitle: this.data.title,
            nbFrontColor: app.globalData.nbFrontColor,
            nbBackgroundColor: app.globalData.nbBackgroundColor,
            realName:app.globalData.investorInfoData["realName"],
          })
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
    /***
     * 处理持仓数据并且显示
     */
    dealPositionData:function(data){
        if(data['overtime']){
            wx.showToast({
              title: '会话超时，请重新登录',
              icon:'none',
            })
            app.delay(1000);
            app.globalData.loginId = ''
            wx.redirectTo({
                url: '/pages/login/login',
            })
        }else{
            // console.log(data)
            let that = this
            for (let i = 0; i < data.length; i++) { 
                that.data.totalValue += data[i]["shareValue"]
                data[i]["son_hidden"] = true
                data[i]['share']  = data[i]['share'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                data[i]['shareValue']  = data[i]['shareValue'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                data[i]['totalCost']  = data[i]['totalCost'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                data[i]['totalProfit']  = data[i]['totalProfit'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                data[i]['floatingProfit']  = data[i]['floatingProfit'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                
                for(let j =0;j<data[i]["positionItemList"].length;j++){
                    data[i]["positionItemList"][j]["share"] = data[i]['positionItemList'][j]["share"].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                    data[i]["positionItemList"][j]["shareValue"] = data[i]['positionItemList'][j]["shareValue"].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
                }
                app.globalData.positionNamelist.push(data[i].agName)
            }
            that.data.positionList = data
            this.setData({
                positionList:that.data.positionList,
                totalValue: app.percentMoney(that.data.totalValue,2),
            })
        }

    },
    /**
     * 查询持仓
     */
    queryPositionList:function(){
        let that = this
        wx.showLoading({
          title: '请等待...',
        })
        // console.log("???")
        wx.request({
            url: app.globalData.serviceUrl+that.data.str_tail,
            data: {
                login_id: app.globalData.loginId,
            },
            success(res){
            //   console.log("????????")
              wx.hideLoading()
              let data = res["data"]
              that.dealPositionData(data)
            },
            fail(){
              wx.hideLoading()
              wx.showToast({
                title: "查询失败",
                icon:"none",
              })
            }
        })
    },

    clickItem: function(idx){
        let index = idx.currentTarget.dataset.index
        console.log("index："+ index + " clicked!")
        for (let i in this.data.positionList){
            if (i == index){
                this.data.positionList[i].son_hidden = !this.data.positionList[i].son_hidden
            }
        }
        this.setData({
            positionList : this.data.positionList,
        })
    },

    refreshData:function(){
        this.data.totalValue = 0
        this.queryPositionList()
        wx.showToast({
            title: "刷新完成",
            icon:"none",
          })
    },

    turnToDetail:function(e){
        let url = '/pages/positionDetail/positionDetail'
        let index1 = e.currentTarget.dataset.idx1
        let index2 = e.currentTarget.dataset.idx2        
        let item = this.data.positionList[index1]
        let sitem = item.positionItemList[index2]

        var data= JSON.parse("{}")

        data['agName'] = item.agName
        data['agCode'] = item.agCode
        data['nv'] = item.nv
        data['share'] = sitem.share
        data['shareValue'] = sitem.shareValue
        data['agNo'] = sitem.agNo
        data['seller'] = sitem.seller
        // console.log(data)
        wx.navigateTo({
          url: url + '?data='+JSON.stringify(data),
        })
    },

    /**
     * 页面的初始数据
     */
    data: {
        title:"我的持仓",
        countLabelStr:"持仓份额",
        navLabelStr:"参考净值",
        priceLabelStr:"参考市值(元)",
        assetsLabelStr:"预估总资产(元)",
        totalValue:0.0,
        eyesSrc:'/resource/ico/eyes_closed.png',
        infoSrc:'/resource/ico/info.png',
        arrowlSrc:'/resource/ico/lower.png',
        arrowlrSrc:'/resource/ico/lower_right.png',
        refreshScr:'/resource/ico/refresh.png',
        listName:"持仓",
        str_tail:"/wx/queryPosition",
        typeStr:["稳健","进取","安锐"],
    },
    TotalValueInfoModal:function(){
        wx.showModal({
            title:"提示",
            content:"[预估总资产]仅供参考，不作对账凭证。计算方式：今日净值X当前份额（[参考市值]同理）",
            showCancel:false,
        })
    }
})