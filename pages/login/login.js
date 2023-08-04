// pages/login/login.js
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
      isHidden:true,
      buttonText:"登录",
      button2Text:"我要输入邀请码",
      inputValue:'',
      buttonDisabled:false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 显示邀请码输入框
     */
    showBindInput:function(){
      console.log("showBindInput")
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction:'ease',
      })
      animation.opacity(1).step()
      this.data.isHidden = false
      this.data.buttonText = "绑定并登录"
      this.data.button2Text = "立即登录"
      this.setData({
        isHidden:this.data.isHidden,
        buttonText:this.data.buttonText,
        button2Text:this.data.button2Text,
        ani:animation.export()
      })
    },
    /**
     * 隐藏邀请码输入框
     */
    hiddenBindInput:function(){
      console.log("hisddenBindInput")
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction:'ease',
      })
      animation.opacity(0).step()
      this.data.isHidden = true
      this.data.buttonText = "登录"
      this.data.button2Text = "我要输入邀请码"
      this.setData({
        isHidden:this.data.isHidden,
        buttonText:this.data.buttonText,
        button2Text:this.data.button2Text,
        ani:animation.export()
      })
    },
    changeBindInput:function(){
      if(this.data.isHidden){
        this.showBindInput()
      }else{
        this.hiddenBindInput()
      }
    },
    /**
     * 查询投资者基金账户，并且跳转到持仓页面
     */
    turnHome:function(){
      console.log("开始请求用户信息")
      wx.request({
        url: app.globalData.serviceUrl+'/wx/myMsg',
        data: {
          login_id: app.globalData.loginId,
        },
        success(res){
          let data = res.data
          app.globalData.investorInfoData = data
          let p = getCurrentPages().pop()
          if(p.onNameRefresh){
            p.onNameRefresh(data["realName"])
          }
          
        },
      })
      wx.switchTab({
        url: app.globalData.positionUrl,
      })
    },

    /**
     * 输入框绑定函数
     */
    codeInput: function(e){
      this.data.inputValue = e.detail.value
    },

    /**
     * 投资者登录
     */
    investorLogin: function(){
      let that = this
      console.log("投资者登录")
      let str_tail = ''
      let invitationCode = ''
      if(this.data.isHidden){
        str_tail = "/wx/login"
      }else{
        str_tail = "/wx/bind"
        invitationCode = this.data.inputValue
      }
      wx.showLoading({
        title: '登录中...',
      })
      this.setData({
        inputValue:"",
      })
      // 登录
      wx.login({
        success(res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          //发起网络请求
          if(res.code){
            console.log("开始发送请求")
            wx.request({
              url: app.globalData.serviceUrl+str_tail,
              data: {
                code: res.code,
                invitation_code:invitationCode,
              },
              success(res){
                wx.hideLoading()
                let data = res["data"]
                
                if(data["stateId"] === 666){
                  app.globalData.key = invitationCode
                  that.setData({
                    inputValue:"",
                    buttonDisabled:false,
                  })
                  wx.navigateTo({
                    url: "../admin/admin"
                  })
                  return
                }
                console.log("投资者登录状态：" + data["msg"]+data["stateId"])
                if(data["stateId"]===0||data["stateId"]===1||data["stateId"]===100){
                  app.globalData.loginId = data["loginId"]
                  console.log("app LoginId:" + app.globalData.loginId)
                  that.turnHome()
                }else{
                  that.showBindInput()
                }
                wx.showToast({
                  title: data["msg"],
                  icon:"none",
                })
              },
              fail(){
                wx.hideLoading()
                wx.showToast({
                  title: "登录超时",
                  icon:"none",
                })
              },
              complete(){
                that.setData({
                  buttonDisabled:false,
                }) 
              }
            })
          }else{
            wx.hideLoading()
            console.log('wx登录请求失败！' + res.errMsg)
            wx.showToast({
              title: "请求微信登录失败",
              icon:"none",
            })
          }
        },
        fail(){
          wx.hideLoading()
          wx.showToast({
            title: "微信请求超时",
            icon:"none",
          })
        },
        complete(){
          that.setData({
            buttonDisabled:false,
          }) 
        }
      })
    },
    /**
     * 获取微信授权
     */
    getUserInfo: function() {
      let that = this
      if(app.globalData.userInfo!=null){
        this.investorLogin()
        return 
      }
      console.log("授权登录")
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '获取你的昵称、头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          // console.log(res)
          app.globalData.userInfo = res.userInfo
          this.investorLogin()
        },
        complete(){
          that.setData({
            buttonDisabled:false,
          }) 
        }

      })
    },
    login:function(){
      this.setData({
        buttonDisabled:true,
      })
      if(!this.data.isHidden && this.data.inputValue===""){
        wx.showToast({
          title: '请输入邀请码',
          icon:"none",
          duration:800,
        })
        this.setData({
          buttonDisabled:false,
        })
      }else{
        this.getUserInfo()
      }

    }
})