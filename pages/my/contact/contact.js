// pages/my/  contact/  contact.js
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
  onLoad: function(e) {
    console.log(e)
    wx.setNavigationBarTitle({
      title: '冻结金记录',
    });
    this.setData({
      projectId: e.projectId,
      projectName: e.projectName,
      freezeMoney: e.money
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //获取解冻详情
    wx.request({
      url: app.url + '/order/auth0/userProjectUseMoney/selFreezeMoneyInfo',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.projectId
      },

      success: res => {
        if (res.data.code == 0) {
          this.setData({
            money: res.data.data
          })
        }
      }
    })
    // 获取职业顾问信息
    this.getPersonal(this.data.projectId)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取职业顾问信息
  getPersonal(projectId) {

    wx.request({
      url: app.url + '/consultant/auth0/consultant/findByProject',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: projectId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            consultantlist: res.data.data
          })
        }
      }
    })
  },
  call(){//打电话
    wx.request({
      url: app.url + '/order/auth0/applyUnfreeze/' + this.data.projectId,
      method: 'post',
      header: {
        token: app.gettoken()
      }
    
    })
    wx.makePhoneCall({
      phoneNumber: this.data.consultantlist[0].phone,
    })
  }
})