// pages/my/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    httpUrl: {
      "正式服": "https://www.hailuo123.com/api",
      "102测试服": "http://192.168.1.102:7999",
      "刘星本地": "http://192.168.1.145:7999",
      "徐连林": "http://192.168.1.32:7999",
      "汪安兵": "http://192.168.1.34:7999",
      "陈星余": "http://192.168.1.140:7999",
      "预发布": "https://hellohailuo.com/api",
      "生产备用": "https://www.hailuozhaowei.com/api",
      "陈星宇92": "http://192.168.1.92:7999",
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
    });

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
    this.setData({
      name: wx.getStorageSync('user').name,
      phone: wx.getStorageSync('user').mobile,
      userimg: wx.getStorageSync('user').headImg,
    })
    //查询用户可用余额
    this.getmoeny()
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
  jump(e) {
    let num=e.currentTarget.dataset.num;
    console.log(num)
    // 核销码
    if(num==1){
      wx.navigateTo({
        url: '/pages/my/control/control',
      }) 
    }
    // 我的订单
    if (num == 2) {
      wx.navigateTo({
        url: '/pages/my/order/order',
      })
    }
    // 我的优惠、
    if (num == 3) {
      wx.navigateTo({
        url: '/pages/my/myOffers/myOffers',
      })
    }
    // 我的收藏
    if (num == 4) {
      wx.navigateTo({
        url: '/pages/my/collection/collection',
      })
    }
    // 意见反馈
    if (num == 5) {
      wx.navigateTo({
        url: '/pages/my/opinion/opinion',
      })
    }
    // 支付密码
    if (num == 6) {
      wx.navigateTo({
        url: '/pages/my/ChangePassword/ChangePassword',
      })
    }
    // 关于我们
    if (num == 7) {
      wx.navigateTo({
        url: '/pages/my/aboutMe/aboutMe',
      })
    }
  },
  //关于我们
  jump7() {
    console.log('关于我们')
    wx.navigateTo({
      url: "/pages/my/aboutMe/aboutMe",
    })
    // 车位飞
    // wx.navigateToMiniProgram({
    //   appId:'wx44e709992bb7ca24',
    //   path: 'pages/index/index',
    //   envVersion: 'release',
    //   success(res) {
    //     // 打开成功
    //   }
    // })
  },
  //跳转到钱包
  gomoeny() {
    //判断有无支付密码
    wx.request({
      url: app.url + '/user/auth0/user/hasSetPayPassword',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.data == false) {
          wx.showModal({
            title: '您还未设置支付密码',
            content: '请设置支付密码',
            confirmColor: '##5DD4A4',
            success: res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/my/SetPassword/SetPassword',
                })
              }
            }
          })
          return


        } else {
          wx.navigateTo({
            url: '/pages/my/money/money',
          })
        }
      }
    })
  },
  // 切换服务器地址
  hotLine(e) {
    let url = e.currentTarget.dataset.url
    app.url = url
    wx.clearStorageSync()
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  showUrl() {
    this.setData({
      showUrl: true
    })
  },
  //查询可用余额
  getmoeny() {
    wx.request({
      url: app.url + '/user/auth0/userMoney/findBalanceAndCashMoney',
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
  onClose() {
    this.setData({
      showUrl: false
    })
  }
})