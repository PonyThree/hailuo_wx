// pages/my/recharge/recharge.js
const app = getApp()
const md5 = require('../../../utils/md5.js')
Page({
  //  页面的初始数据
  data: {
    name: wx.getStorageSync('user').name,
    show: false,
    moeny1:0
  },
  onClose(){
    this.setData({
      show:false
    })
  },
  onLoad(e) {},
  onShow() {
    wx.request({
      url: app.url + '/user/auth0/userMoney/findBalanceAndCashMoney',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            moeny: res.data.data
          })
        }
      }
    })
  },
  moeny(e){
    this.setData({ 
      moeny1:e.detail.value
    })
  },
  showInputLayer(){//点击下一步
    if(this.data.moeny.length<1){
      return
    }
    if (this.data.moeny1 < 1) {
      wx.showToast({
        title: '必需提现1元以上',
        icon: 'none'
      })
      return
    }
    if (this.data.moeny1 > this.data.moeny.cashMoney){
      wx.showToast({
        title: '可提现金额不足',
        icon: 'none'
      })
      return
    }
    this.setData({
      show:true
    })
  },
  //输入6位数密码后
  pay:function(e){
    console.log(e.detail)
    this.setData({
      show: false
    })

    wx.request({
      url: app.url + '/user/auth0/userMoney/cashMoney',
      method: 'post',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        money: this.data.moeny1,
        password: md5.hexMD5(e.detail)
      },
      success: res => {
       
        if(res.data.code==0){
          wx.showToast({
            title: '提现成功',
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1000)   
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  }
})