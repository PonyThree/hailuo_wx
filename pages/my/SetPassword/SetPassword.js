const md5 = require('../../../utils/md5.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:"",
    password1:"",
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '设置支付密码',
    });
    this.setData({
      name: wx.getStorageSync('user').name,
      phone: wx.getStorageSync('user').mobile,
      userimg: wx.getStorageSync('user').headImg,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  //获取用户设置的支付密码
  password: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  password1: function(e) {
    this.setData({
      password1: e.detail.value
    })
  },
  //点击确定支付按钮

  confim() {
    if (this.data.password.length < 6 || this.data.password1.length < 6) {
      wx.showToast({
        title: '支付密码太简单了哦!',
        icon:'none'
      })
      return
    }
    if (this.data.password!== this.data.password1){
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: app.url + '/user/auth0/user/setPayPassword',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data:{
        payPasswordOne: md5.hexMD5(this.data.password)
      },
      success: res => {
        if(res.data.code==0){
          wx.showModal({
            title: '支付密码设置成功',
            showCancel: false,
            confirmColor: '##5DD4A4',
            success: res => {
              if (res.confirm) {
               wx.navigateBack({
                 delta:1
               })
              }
            }
          })
        }      
      }
      
    })

    return
  }

})