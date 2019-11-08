// pages/project/msg_details/msg_details.js
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
    wx.setNavigationBarTitle({
      title: "消息"
    })
    app.stopShare();
    console.log(e)
    this.setData({
      projectname: e.projectname,
      msg:e.msg,
      projectId: e.projectId,
      id:e.id
    })
    //获取消息列表详情
    wx.request({
      url: app.url + '/user/auth0/userMsgTab/getConInfo?projectId=' + this.data.projectId,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            list: res.data.data
          })
        }
      }
    })
    //修改消息已读状态
    wx.request({
      url: app.url + '/user/auth0/userMsgTab/updRead?id=' + this.data.id,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
    
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成i
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
  //拨打电话
  call(){
    wx.makePhoneCall({
      phoneNumber: this.data.list.conPhone,
    })
  }
})