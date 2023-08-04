// pages/inputDlgPopup/inputdlg.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:"提示",
        },
        fundAcc:{
            type:String,
            value:"无",
        },
        name:{
            type:String,
            value:"无",
        },
        inputInvitationCode:{
            type:String,
            value:"",
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        content:"添加/修改授权邀请码",
        cancelTxt:"取消",
        confirmTxt:"确认修改",
        inputAdminCode:"",
        refreshUrl:"/resource/ico/refresh.png",
        inputAdminCode:'',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindConfirm:function(){
            let that = this
            if(this.data.inputInvitationCode.length!=6){
                wx.showToast({
                  title: '请输入6位邀请码',
                  icon:'none'
                })
                return
            }
            if(this.data.inputAdminCode.length<=0){
                wx.showToast({
                  title: '请输入管理员码',
                  icon:'none'
                })
                return
            }
            //发出请求
            let str_tail = "/wx/modifyInvitationCode"
            if(that.data.fundAcc==="无"){
                wx.showToast({
                  title: '无效账户',
                  icon:'none'
                })
                return
            }
            console.log(that.data.inputInvitationCode)
            wx.request({
              url: app.globalData.serviceUrl+str_tail,
              data: {
                invitation_code: that.data.inputInvitationCode,
                admin_code: that.data.inputAdminCode,
                fund_acc: that.data.fundAcc
              },
              success(res){
                let data = res.data
                console.log(data)
                if(data===true){
                    wx.showToast({
                      title: '修改成功',
                      complete(){
                          that.closedlg(true)
                      }
                    })
                }else{
                    wx.showToast({
                        title: '修改失败，邀请码已被使用',
                        icon:"none",
                      })
                }
                
              },
            })
        },
        refreshCode:function(){
            let that = this
            // if(that.data.fundAcc==="无"){
            //     wx.showToast({
            //       title: '无效账户',
            //       icon:'none'
            //     })
            //     return
            // }
            let str_tail = "/wx/newInvitationCode"
            
            wx.request({
                url: app.globalData.serviceUrl+str_tail,
                success(res){
                    let data = res.data + ""
                    if(data.length === 6){
                        that.data.inputInvitationCode = data
                        that.setData({
                            inputInvitationCode:that.data.inputInvitationCode
                        })
                    }
                  },  
            })
        },
        bindInputadmin:function(e){
            let code = e.detail.value
            this.data.inputAdminCode = code;
        },
        bindInputCode:function(e){
            let code = e.detail.value
            console.log(code)
            this.data.inputInvitationCode = code;
        },
        closedlg:function(isConfirm){
            if(isConfirm!= true){
                isConfirm = false
            }
            this.setData({
                inputInvitationCode:'',
                inputAdminCode:'',
            })
            this.triggerEvent("hiddenInputDlg",{isConfirm:isConfirm})
        }
    }
})
