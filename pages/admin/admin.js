// pages/admin/admin.js
const app = getApp()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        nbTitle:"管理员界面",
        fundLabel:"基金账号",
        nameLabel:"投资者姓名",
        codeLabel:"绑定邀请码",
        usedLabel:"已使用",
        modifyButtonName:"修改",
        inputDlghidden:true,
        usedUrl:"/resource/ico/used.png",
        searchUrl:"/resource/ico/search.png",
        modifyUrl:"/resource/ico/modify.png",
        investorList:[],
        hiddenList:[],
        inputValue:'',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("page admin in")
        this.queryList()
    },

    bindConfirm:function(e){
        let key = e.detail.value
        this.refreshList(key)
    },
    bindInput:function(e){
        this.data.inputValue = e.detail.value
    },

    /**
     * 刷新列表
     */
    refreshList(value){
        let that = this
        let key = value
        if(key != undefined && key != ''){
            for(var i=0;i<that.data.investorList.length;i++){
                let item = that.data.investorList[i]
                if(item['realName'].indexOf(key) >=0){
                    item["isHidden"] = false
                }else{
                    item["isHidden"] = true
                }
            }
            this.setData({
                investorList:that.data.investorList
            })
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this
        wx.showModal({
            title:'刷新',
            content:"是否刷新列表",
            success:function(res){
                if(res.confirm){
                    that.queryList()
                }
            }
        })
    },


    /***
     * 查询列表
     */
    queryList:function(){
        let str_tail = "/wx/getAllInvestors"
        let that = this
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
            url: app.globalData.serviceUrl + str_tail,
            data: {
                admin_code: app.globalData.key,
            },
            success(res){
                let data = res["data"]
                if(data["code"]===-1){
                    wx.showToast({
                      title: '非法访问',
                    })
                }else{
                    // console.log(data)
                    that.data.investorList = data
                    // console.log(data)
                    for(var i=0;i<that.data.investorList.length;i++){
                        let item = that.data.investorList[i]
                        item["isHidden"] = false
                        
                    }
                    // console.log(data)
                    that.setData({
                        investorList:that.data.investorList
                    })
                }
            },
            complete(){
                wx.hideLoading()
            }
        })
    },
    /**
     * 管理员修改邀请码 
     */
    bindTapModify:function(e){
        let index = e.currentTarget.dataset.idx
        let item = this.data.investorList[index]
        if(item["invitationCode"]===undefined){
            item["invitationCode"]=""
        }
        this.setData({
            dlgFundAcc:item["fundAcc"],
            dlgRealName:item["realName"],
            dlgInvitationCode:item["invitationCode"],
            inputDlghidden:false,
        })
    },

    /***
     * 
     * 弹窗关闭
     */
    hiddenInputDlg:function(e){
        // console.log(e.detail.isConfirm)
        this.data.hiddenInputDlg = true
        this.setData({
            inputDlghidden:this.data.hiddenInputDlg
        })
        if(e.detail.isConfirm){
            this.queryList()
            let key = this.data.inputValue
            if(key!=''){
                this.refreshList(key)
            }
        }
    },

    exitPage:function(){
        wx.navigateBack({
          delta: 1,
        })
    }
})