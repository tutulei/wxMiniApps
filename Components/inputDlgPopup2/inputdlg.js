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
        inputAuthorizeCode:{
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
        inputConfirmStr:"",
        refreshUrl:"/resource/ico/refresh.png",
    },

    /**
     * 组件的方法列表
     */
    methods: {

        bindConfirm:function(){
            let that = this
            if(this.data.inputAuthorizeCode.length!=6){
                wx.showToast({
                  title: '请输入6位邀请码',
                  icon:'none'
                })
                return
            }
            // if(this.data.inputConfirmStr != '确认'){
            //     wx.showToast({
            //       title: '请在第二个输入框输入“确认”二字',
            //       icon:'none',
            //       duration:2000
            //     })
            //     return
            // }
            //发出请求
            let str_tail =  "/wx/modifyAuthorizeCode"
            console.log(that.data.inputAuthorizeCode)
            wx.request({
              url: app.globalData.serviceUrl+str_tail,
              data: {
                authorize_code: that.data.inputAuthorizeCode,
                login_id: app.globalData.loginId,
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

            let str_tail = "/wx/newInvitationCode"
            
            wx.request({
                url: app.globalData.serviceUrl+str_tail,
                success(res){
                    let data = res.data + ""
                    if(data.length === 6){
                        that.data.inputAuthorizeCode = data
                        that.setData({
                            inputAuthorizeCode:that.data.inputAuthorizeCode
                        })
                    }
                  },  
            })
        },
        bindInputCode:function(e){
            let code = e.detail.value
            console.log(code)
            this.data.inputAuthorizeCode = code;
        },
        bindInputConfirm:function(e){
            let code = e.detail.value
            console.log(code)
            this.data.inputConfirmStr = code;
        },
        closedlg:function(isConfirm){
            if(isConfirm != true){
                isConfirm = false
            }
            
            this.setData({
                inputAuthorizeCode:'',
                inputConfirmStr:'',
            })
            this.triggerEvent("hiddenInputDlg",{isConfirm:isConfirm})
        }
    }
})
