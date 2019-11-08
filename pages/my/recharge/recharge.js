// pages/my/recharge/recharge.js
const app=getApp()
var paytime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '零钱充值',
    });
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
    clearInterval(paytime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(paytime)
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
  // 下一步输入支付密码
  showInputLayer(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.url + '/user/auth0/userMoney/chargeMoney',
      method: "post",
      header: {
        token: app.gettoken(),
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        money: this.data.moeny
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 0) {
          let req = res.data.data
          //调取原生支付接口
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: 'prepay_id=' + res.data.data.prepayId,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success: function (res) {
              console.log(res, "成功")
              wx.showLoading({
                title: '正在处理',
              })
               paytime = setInterval(() => { //一直获取订单回调 直到后台订单响应
                wx.request({
                  url: app.url + '/user/auth0/userMoneyUseRecording/rechargeResult/' + req.orderNo,
                  method: 'get',
                  header: {
                    token: app.gettoken()
                  },
                  success: res => {
                    if (res.data.code == 0) {
                      wx.hideLoading()
                      clearInterval(paytime)
                      wx.navigateTo({
                        url: '/pages/my/money/money',
                      })
                    }
                    else if (res.data.code != -1) {
                      wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                      })
                      clearInterval(paytime)
                    }

                  }
                })
              }, 1000)
            },
            fail: function (res) {
              console.log(res, "失败")
            },
            complete: function (res) {
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

 
  },
  // 隐藏支付密码输入层
  hidePayLayer() {
    var val = this.data.pwdVal;
    this.setData({ 
      showPayPwdInput: false,
      payFocus: false, 
      // pwdVal: '' 
    }, 
    function () {
      wx.showToast({
        title: "输入失败",
      })
    });
  },
  // 获取焦点
  getFocus() {
    this.setData({ 
      payFocus: true 
    });
  },
  // 输入密码监听
  inputPwd(e) {
    this.setData({ 
      pwdVal: e.detail.value 
    });
    if (e.detail.value.length > 6) {
      this.hidePayLayer();
    }
  }
  ,
  moeny(e) {
    this.setData({
      moeny: e.detail.value
    });
  }
})