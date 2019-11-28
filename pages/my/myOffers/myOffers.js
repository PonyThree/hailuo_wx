// pages/my/myOffers/myOffers.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:['未使用','已使用','已过期'],
    actNum:'0',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的优惠',
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
  choseNum(e){
    this.setData({
      actNum:e.detail
    })
    console.log(this.data.actNum)
  },
  // 展开规则
  showRegular(){
    this.setData({
      show:!this.data.show
    })
  },
  // 去使用
  goUse(){

  }
})