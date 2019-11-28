// pages/firstPage/commonProblem/commonProblem.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认展开第几个
    activeName:'',
    bool:false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '常见问题',
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
    let projectId=wx.getStorageSync('dataid')
    wx.request({
      method:'get',
      url: app.url + '/project/auth0/questionTab/getList?projectId=' + projectId,
      header:{
        token:app.gettoken()
      },
      success:res=>{
        if(res.data.code==0){
          this.setData({
            list:res.data.data
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
  // 折叠面板事件
  onChange(e){
    this.setData({
      activeName:e.detail
    })
  }
})