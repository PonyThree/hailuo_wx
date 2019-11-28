// pages/firstPage/loans/detailMessage/detailMessage.js
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
    this.setData({
      detailData: JSON.parse(options.params)
    })
  },

})