// pages/order/Agreement/Agreement.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
      var that = this;
      console.log(e);
      var type=e.type;
      var buyName=e.buyName||'认购';
           //落位 1 认购2
          wx.request({
              method: 'post',
              url: app.url + '/project/auth0/miniProject/projectAgreement',
              header: {
                  token: app.gettoken(),
                  "Content-Type": "application/x-www-form-urlencoded"
              },
               data: {
                   'projectId': e.projectId,
                   "type": type
               },
              success: res => {
                  console.log(res.data.data);
                  that.setData({
                      agreeMent: res.data.data
                  })
              }
          })
          if(type=='1'){
              wx.setNavigationBarTitle({
                  title: '落位协议',
              })
          }else{
              wx.setNavigationBarTitle({
                  title: `${buyName}协议`,
              })
          }
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

  }
})