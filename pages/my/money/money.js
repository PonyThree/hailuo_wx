// pages/my/money/money.js
const  app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '钱包',
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
    //查询用户可用余额
    this.getmoeny()
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
  // 零钱充值
  recharge(){
    wx.navigateTo({
      url: '/pages/my/recharge/recharge',
    })
  },
  // 查看零钱记录跳转
  jump(){
    wx.navigateTo({
      url: '/pages/my/record/record',
    })
  },
  //去到冻结金列表
  gofrozen(){
    wx.navigateTo({
      url: '/pages/my/frozen/frozen',
    })
  },
  //查询可用余额
  getmoeny() {
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
  //去提现
  extract_money(){
    wx.navigateTo({
      url: '/pages/my/extract_money/extract_money',
    })
  }
})