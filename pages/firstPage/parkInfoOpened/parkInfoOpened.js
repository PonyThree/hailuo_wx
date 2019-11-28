// pages/firstPage/parkInfoOpened/parkInfoOpened.js
const app = getApp()
var timer, actiivityTimer
const { $Toast } = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacity: 1,
    isInit: false,
    stepsList:[
      { id: '1', name: '线上付款', content:'(落位、认购)'},
      { id: '2', name: '系统审核', content:''},
      { id: '3', name: '线下签约', content:'(结清 尾款)'},
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.carid) this.setData({
      carid: options.carid
    })
    else {
      this.setData({
        carid: '3706756970963795968'
      })
    }

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
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.url + '/product/auth0/miniTruckSpace/' + this.data.carid,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        clearInterval(timer)
        clearInterval(actiivityTimer)
        wx.hideLoading()
        if (res.data.code == 0) {
          this.setData({
            data: res.data.data,
            isInit: 1
          })
          if (res.data.data.sellStatus == 4) { //如果未开盘
            //格式化时间为天,小时,分!
            var addtime = res.data.data.openStartTime - app.newDate()
            this.gettime(addtime, 'djs')
            timer = setInterval(() => {
              addtime -= 1000
              if (addtime < 1000) {
                clearInterval(timer)
                this.setData({
                  [`data.sellStatus`]: 0
                })
              }
              this.gettime(addtime, 'djs')
            }, 1000)

          }
          if (res.data.data.actityInfo.actStatus == 2) { //活动未开盘
            let staTime = res.data.data.actityInfo.staTime

            this.ActivityDjs(res.data.data.actityInfo.actStatus, staTime)

          }
          if (res.data.data.actityInfo.actStatus == 1) { //活动已开盘
            let endTime = res.data.data.actityInfo.endTime
            this.ActivityDjs(res.data.data.actityInfo.actStatus, endTime)
          }

          this.getorder(this.data.carid) //根据车位获取订单
          this.getPersonal() //获取职业顾问信息列表

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(timer)
    clearInterval(actiivityTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(timer)
    clearInterval(actiivityTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    this.onShow(),
      wx.showNavigationBarLoading(),
      setTimeout(() => {
        app.stopre()
      }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  share() {
  
    this.onShareAppMessage()
  },
  onShareAppMessage: function() {
    let url = `/pages/firstPage/parkInfoOpened/parkInfoOpened?carid=${this.data.carid}`

    return {
      title: "找车位，上「海螺」",
      path: url
    }
  },
  //提示车位状态
  goback() {
    wx.showModal({
      title: '很抱歉，此车位暂不能落位',
      content: '可能原因\r\n1.您的车位落位数已满\r\n 2.该车位落位人数已满\r\n3.车位未开通落位通道\r\n4.该车位已售出',
      showCancel: false
    })
  },
  //用户收藏收藏车位
  Collection() {
    if (this.data.data.collect) { //用户收藏了就删除
      let truckSpaceIds = [this.data.data.id]
      wx.request({
        url: app.url + '/user/auth0/user/carNotCollect',
        method: 'post',
        header: {
          token: app.gettoken()
        },
        data: truckSpaceIds,

        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '取消收藏',
              icon: "clear"
            })
          }
          this.onShow()
        }
      })

    } else {
      let truckSpaceId = this.data.data.id
      wx.request({
        url: app.url + '/user/auth0/user/carCollect?truckSpaceId=' + truckSpaceId,
        method: 'post',
        header: {
          token: app.gettoken()
        },
        data: {
          truckSpaceId
        },
        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '收藏成功',
            })
            this.onShow()
          }
        }
      })
    }
  },
  // 跳转到落位订单页面
  godrop() {
  
    wx.navigateTo({
      url: '/pages/order/drop/drop?carid=' + this.data.data.id,
    })
  },
  //跳转到认购页面
  gosubscription() {
    wx.navigateTo({
      url: '/pages/order/subscription/subscription?carid=' + this.data.data.id,
    })
  },
  //格式化时间戳
  gettime: function(my_time, djs) {
    var days = my_time / 1000 / 60 / 60 / 24;
    var daysRound = Math.floor(days);
    var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
    var hoursRound = Math.floor(hours);
    var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    var minutesRound = Math.floor(minutes);
    var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    this.setData({
      [`${djs}`]: [daysRound, hoursRound, minutesRound, Math.floor(seconds)]

    })
  },
  //根据车位ID获取订单信息

  getorder(id) {
    wx.request({
      url: app.url + '/order/auth0/orderForm/orderInfoByTruckSpaceId/' + id,
      method: 'get',
      header: {
        token: app.gettoken(),
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            lookup: res.data.data
          })
        }
      }

    })
  },
  //获取职业顾问信息
  getPersonal() {

    wx.request({
      url: app.url + '/consultant/auth0/consultant/findByProject',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.data.projectId
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
  //跳转到个人中心订单页面
  goorder() {
    wx.navigateTo({
      url: '/pages/my/order/order',
    })
  },
  //拨打电话
  call(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.consultantlist[0].phone,
    })

  },
  previewImage1(e) {

    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: e.target.dataset.list // 需要预览的图片http链接列表
    })
  },
  showPrice() { //显示车位计算价格
    this.selectComponent('#filter-cmp').showPrice()
  },
  ActivityDjs(actStatus, time) { //根据开盘状态设置倒计时样式
    if (actStatus == 2) { //未开盘
      let my_time = time - app.newDate()
      this.gettime(my_time, 'activetiyDjs')
      actiivityTimer = setInterval(_ => {
        this.gettime(my_time -= 1000, 'activetiyDjs')
        if (my_time <= 1000) {

          clearInterval(actiivityTimer)
          this.setData({
            [`data.actityInfo.actStatus`]: '0',
            [`data.sellPrice`]: this.data.data.actityInfo.seckillPrice
          })
        }
      }, 1000)
    } else if (actStatus == 1) { //已开盘
      let my_time = time - app.newDate()
      this.gettime(my_time, 'activetiyDjs')
      actiivityTimer = setInterval(_ => {
        this.gettime(my_time -= 1000, 'activetiyDjs')
        if (my_time <= 1000) {
          clearInterval(actiivityTimer)
          this.setData({
            [`data.actityInfo.actStatus`]: '3',
            [`data.sellPrice`]: (this.data.data.actityInfo.seckillPrice + this.data.data.actityInfo.reducePrice)
          })
        }
      }, 1000)
    }
  },
  // 认购之前验证
  clickInfo(){
    $Toast({
      content: '该车位只能落位后认购'
    })
  },
  //去常见问题页面
  goProblem(){
    wx.navigateTo({
      url: '/pages/firstPage/commonProblem/commonProblem',
    })
  },
  // 去车位贷款
  goLoans(){
    wx.navigateTo({
      url: '/pages/firstPage/loans/loans',
    })
  }

})