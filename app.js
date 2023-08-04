// app.js
App({
  onLaunch() {
    console.log('进入app')
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
    ValueToStr:function(n){
        let ret = ''
        if(n<1000){
            ret = n+''
        }else{
            let data = n
            while(true){
                var remainder = parseInt((data % 1000)*100)/100
                if(remainder < 10){
                    remainder = '00'+remainder
                }else if(remainder < 100){
                    remainder = '0' + remainder
                }
                ret = ','+ remainder + ret
                data = parseInt(data/1000)
                if(data<1000){
                    if(data === 0){
                        ret = ret.substr(1)
                    }else{
                        ret = data + ret
                    }
                    break
                }
            }
        }
        //console.log('in:'+n + '  out:' + ret + '  b.toLocaleString():' + n.toLocaleString())
        return ret
    },

    percentMoney:function(s,n){
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
        var l = s.split('.')[0].split('').reverse();
        var r = s.split('.')[1];
        var t = '';
        for( var i = 0; i < l.length; i++){
            t += l[i] + ((i + 1) % 3==0 && (i + 1) != l.length ? ',':'');
        }
        return t.split('').reverse().join('') +  '.' + r;
    },

    delay:function(milSec){
        return new Promise(resolve => {
            setTimeout(resolve, milSec)
          })
    },
  globalData: {
    userInfo: null,
    key:"",
    positionUrl:"/pages/Position/position",


    //导航栏配置 fa9070
    nbFrontColor: '#000000', //顶部标题开始背景
    nbBackgroundColor: '#ffffff', //结束背景

    //
    serviceUrl:"https://www01.mtcf.cn:18443",
    // serviceUrl:"https://localhost:18443",
    
    loginId:"",
    investorInfoData:{},


    positionNamelist:[],
  }
})
