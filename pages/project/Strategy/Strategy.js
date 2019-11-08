// pages/project/Strategy/Strategy.js
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
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选位攻略'
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
    //获取首页咨询
    wx.request({
      url: app.url + '/platform/auth0/softArticle/findList',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            findlists: res.data.data
          })
        }
      }
    })

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
  //跳转到H5软文页面
  web(e) {
    let id = e.currentTarget.dataset.id
    wx.request({
      url: app.url + '/platform/auth0/softArticle/addSeeNum',
      header: {
        token: app.gettoken()
      },
      data:{
        id
      },
      success: res => {
        if (res.data.code == 0) {

        }
      }
    })
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/project/webview/webview?url=' + url,
    })
  },
})