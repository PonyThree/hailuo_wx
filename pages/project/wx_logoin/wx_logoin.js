// pages/wx_logoin/wx_logoin.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '根据物权法政策，小区需获取业主手机号码，用于向物业所有者审核业主身份，以保障车位订单合法性。',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: false,
    show: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '微信登录'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.setData({
      show: wx.getStorageSync('logoshow')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync("wx", this.data.userInfo)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.setStorageSync("wx", this.data.userInfo)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.setStorageSync("wx", this.data.userInfo)
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
  logoin: function() {
    wx.login({
      success: res => {

        let code = res.code
        wx.request({
          url: app.url + '/user/wx/login',
          method: "get",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            code: code
          },
          success: res => {
            if (res.data.code == 0) {
              this.setData({
                key: res.data.data
              })
            } else {
              wx.showToast({
                title: '拉取授权失败',
                icon: 'none'
              })
            }
          }
        })
      }
    })


  },
  phonelogoin: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  getUserInfo: function() {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync("wx", this.data.userInfo)
      }
    })

  },
  //获取用户手机号
  getPhoneNumber(e) {
    let wxlist = wx.getStorageSync('wx')
    let key = this.data.key
    wx.request({
      url: app.url + '/user/user/registry',
      method: "post",
      data: {
        "encrypted": e.detail.encryptedData,
        "headImage": wxlist.avatarUrl,
        "iv": e.detail.iv,
        "name": wxlist.nickName,
        "openid": key.openId,
        "sessionKey": key.sessionKey,
        'unionid': key.unionid
      },
      success: res => {
        if (res.data.code == 0) {
          wx.setStorageSync('token', res.data.data.lastToken)
          app.logo()
          wx.showToast({
            title: '登陆成功',
          })
          setTimeout(()=>{
            let e = wx.getStorageSync('e')
          try{
            if (Object.keys(e.query).length !== 0 && e.query.projectId) {
              wx.reLaunch({
                url: '/' + e.path + `?projectId=${e.query.projectId}`,
              })
            }
            else {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }catch(err){
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
           
           
          },1000)
        }
      }
    })
  },
  //微信登陆按钮两次隐藏
  getappid(code) {
    this.setData({
      zindex: 0
    })
  },
 

})