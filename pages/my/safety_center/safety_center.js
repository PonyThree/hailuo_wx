// pages/my/safety_center/safety_enter.js
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
      title: '安全中心',
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
  // 修改支付密码
  jump1() { 
    wx.navigateTo({
      url: '/pages/my/binding_phone/binding_phone',
    })
  },
  // 忘记支付密码
  jump2() {
    wx.navigateTo({
      url: '/pages/my/binding_phone/binding_phone',
    })
  },
  // 换账号登录
  jump3() { 
    wx.navigateTo({
      url: '/pages/my/binding_phone/binding_phone',
    })
  },
  // 退出登录
  jump4() { 
    wx.showModal({
      title: '确定退出？',
      duration: 1000,
      mask: true,
      success: function (res) {
        if (res.confirm) {
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
})