// pages/activity/MultiplayerGroup/MultiplayerGroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    // 是否已经参团或者创团
    hasJoinGroup: false,
    percent:40,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '加入拼团',
    })
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
  // 活动车位
  seeActList() {

  },
  // 活动规则
  seeRegular() {
    this.setData({
      showRegular: true
    })
  },
  onClose() {
    this.setData({
      showRegular: false
    })
  },
  // 参团
  joinGroup() {
    console.log('参团')
    wx.navigateTo({
      url: '/pages/activity/MultiplayerGroup/groupDetails/groupDetails',
    })
  },
  // 查看更多
  findMore() {

  }
})