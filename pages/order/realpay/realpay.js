// pages/order/drop/drop.js
const app = getApp()
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
    console.log(e)
    if (e.orderNo) this.setData({ orderNo: e.orderNo })
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

    this.getorderlist() //获取订单详情


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
 
 

  //获取订单信息
  getorderlist() {
    //获取订单信息
    wx.request({
      url: app.url + '/order/auth0/orderForm/' + this.data.orderNo,
      method: 'get',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            orderlist: res.data.data,
              contractName: res.data.data.contractName,
              contractMobile: res.data.data.contractMobile,
              contractIdcard: res.data.data.contractIdcard
          })
          this.getcarlist(res.data.data.truckSpaceId) //获取车位

        } else if (res.data.code != 15) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //获取车位相信信息
  getcarlist(carid) {
    //获取车位详情
    wx.request({
      url: app.url + '/product/auth0/miniTruckSpace/' + carid,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            data: res.data.data
          })
     

        }
      }
    })
  },

  //返回首页
  goindex(){
    app.goindex()
  },
  //去核销列表
  gocontrol(){
    wx.navigateTo({
     url: "/pages/my/control/control"
    })
  }
})