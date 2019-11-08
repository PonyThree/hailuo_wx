// pages/my/frozen/frozen.js
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
      title: '冻结金记录',
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
    this.getlist()
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
  //去到解冻二维码列表
  gocontact(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    let money = e.currentTarget.dataset.money
    let projectName = e.currentTarget.dataset.projectname
    let url = `projectId=${id}&money=${money}&projectName=${projectName}`
    console.log(url)
    wx.navigateTo({
      url: '/pages/my/contact/contact?'+url,
    })
  },
  //查询冻结余列表
  getlist() {
    wx.request({
      url: app.url + '/user/auth0/userProjectUseMoney/findFreezeList',
      method: 'get',
      header: {
        token: app.gettoken()
      },

      success: res => {
        if (res.data.code == 0) {
          this.setData({
            moeny: res.data.data
          })
        }
      }
    })
  },
})