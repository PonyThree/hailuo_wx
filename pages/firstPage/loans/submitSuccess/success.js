// pages/firstPage/loans/submitSuccess/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      detailData: options.params
    })
  },
  /**
   * 跳转到车位列表
   */
  selectCar: function () {
    wx.switchTab({
      url: '/pages/firstPage/projectIndex/projectIndex',
    })
  },
  /**
   * 查看资料
   */
  lookData: function () {
    wx.navigateTo({
      url: '/pages/firstPage/loans/detailMessage/detailMessage?params=' + this.data.detailData
    })
  },
})