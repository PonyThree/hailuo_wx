//app.js

App({
  onLaunch: function (e) {
    //检查更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () { // 新的版本下载失败
    })
    // 获取用户信息
    this.logo()
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    if (e.query.q) { //判断是否为扫码进入
      console.log(e)
      var scanid = e.query.q.substring(e.query.q.lastIndexOf('D') + 1)
      wx.setStorageSync('scanid', scanid)
    }
  },
  //获取微信信息
  globalData: {
    userInfo: null
  },
  header: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  //获取当前时间戳
  newDate: function () {
    return new Date().getTime()
  },
  //禁止页面转发
  stopShare() {
    wx.hideShareMenu()
  },
  //停止下拉刷新
  stopre: () => {
    wx.hideLoading()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  //小程序登陆刷新token
  logo() {
    wx.request({
      url: this.url + '/auth/mini/login',
      method: "post",
      data: {
        token: wx.getStorageSync('token') || 0
      },
      success: res => {
        if (res.data.code == 0) {
          wx.setStorageSync('token', res.header.token)
          wx.setStorageSync('user', res.data.data)
        } else {
          wx.redirectTo({
            url: '/pages/project/wx_logoin/wx_logoin',
          })
        }
      }
    })
  },
  //获取token
  gettoken: () => {
    return wx.getStorageSync('token')
  },
  // 返回首页
  goindex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
//   url: "https://www.hailuo123.com/api",
  // url: "http://118.25.60.79:7999",
  // url: "http://192.168.1.32:7999", //徐联林// 
  // url:'http://192.168.1.92:7999',//陈星余
  // url:'https://pre.api.hailuo123.com/api'
   url:'http://192.168.1.140:7999',//陈星余
//   url:'https://www.hailuozhaowei.com/api',
//    url:"http://192.168.1.101:7999" , /////
  //url:'https://www.hailuozhaowei.com/api',
  //  url:"http://192.168.1.101:7999"  
  http: require('./utils/request.js') //引入自定义请求
})