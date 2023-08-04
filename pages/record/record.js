// pages/record/record.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"申赎记录",
        dateValue1:'全部',
        dateValue2:'全部',
        productValue:'全部',
        tradeRecordList:[],
        productList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.queryRecordList()
        let today = new Date()
        let dayStr = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        this.data.productList.push('全部')
        this.data.productList = this.data.productList.concat(app.globalData.positionNamelist)
        this.setData({
            dateValue2: dayStr,
            productList:  this.data.productList,
        })
        // this.setData({
        //     startDate: "全部",
        //     endDate:"全部",
        // })
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
        console.log("page record show")
        this.setData({
            nbTitle: this.data.title,
            nbFrontColor: app.globalData.nbFrontColor,
            nbBackgroundColor: app.globalData.nbBackgroundColor,
          })
    },
    datePickerBindchange1:function(e){
        this.setData({
          dateValue1:e.detail.value
        })
    },    
    datePickerBindchange2:function(e){
        this.setData({
          dateValue2:e.detail.value
        })
    },
    productPickerBindChange:function(e){
        this.setData({
            productValue: this.data.productList[e.detail.value]
        })
    },
    refreshList:function(){
        let that=this
        that.data.dateValue1='全部',
        that.data.dateValue2='全部',
        that.data.productValue='全部'
        that.setData({
            dateValue1:that.data.dateValue1,
            dateValue2:that.data.dateValue2,
            productValue:that.data.productValue,
         })
        //  console.log('refreshList')
    },
    queryRecordList:function(){
        let str_tail = "/wx/queryTradeRecord"
        let that = this
        console.log("queryRecordList")
        wx.request({
            url: app.globalData.serviceUrl+str_tail,
            data: {
                login_id: app.globalData.loginId,
            },
            success(res){
                let data = res.data
                // console.log(data)
                that.data.tradeRecordList = data
                for (var i = 0; i < data.length; i++) { 
                    data[i]["confirmNum"] = app.ValueToStr(data[i]["confirmNum"])
                    data[i]["confirmBalance"] =app.ValueToStr(data[i]["confirmBalance"])
                }
                that.setData({
                    tradeRecordList:data,
                 })
            },
            fail(){
                console.log("fail;")
            }
        })
    },
})