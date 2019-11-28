// pages/order/drop/drop.js
const app = getApp()
const md5 = require('../../../utils/md5.js')
var settime1, paytime, buyName
Page({
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    if (e.carid) this.setData({
      carid: e.carid
    })
    app.stopShare();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getcarlist(this.data.carid) //获取车位详情


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(settime1)
    clearInterval(paytime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(settime1)
    clearInterval(paytime)
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
  // 认购支付成功
  godropsuccess() {
    if (this.data.payStatus) return  //点击支付后防重复点击
    wx.showLoading({
      title: '请稍后',
    })
    this.setData({
      payStatus: true
    })
    if (this.data.openStatus == 0) {
      wx.showToast({
        title: '抱歉,开盘时间未到',
        icon: 'none'
      })
      return
    }
   
    var data = this.selectComponent("#getContract").getContract()
    data.truckSpaceId = this.data.data.id
    data.type=2

    var that = this;
    //微信支付
    wx.request({
      url: app.url + '/product/auth0/subPayTruckSpace',
      method: "post",
      header: {
        token: app.gettoken()
      },
      data: data,
      success: res => {
        wx.hideLoading()
        if (res.data.code == 0) {
          let req = res.data.data
          //调取原生支付接口
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: 'prepay_id=' + res.data.data.prepayId,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success: function(res) {
              console.log(res, "成功")
              wx.showLoading({
                title: '正在处理',
              })
              paytime = setInterval(() => { //一直获取订单回调 直到后台订单响应
                wx.request({
                  url: app.url + '/order/auth0/orderForm/' + req.orderNo,
                  method: 'get',
                  header: {
                    token: app.gettoken()
                  },
                  success: res => {
                    if (res.data.code == 0) {
                      wx.hideLoading()
                      clearInterval(paytime)
                      wx.navigateTo({
                        url: '/pages/my/order/order'
                      })
                    } else if (res.data.code != 15) {
                      wx.hideLoading()
                      // 支付失败,弹出层
                      that.setData({
                        showRg: true,
                        msg: res.data.msg
                      })
                      clearInterval(paytime)
                    }
                  }
                })
              }, 1000)
            },
            fail: function(res) {
              that.setData({
                payStatus: false
              })
            },
            complete: function(res) {
              that.setData({
                payStatus: false
              })
              console.log(res)
            }
          })
        } else {
       
          that.setData({
            showRg: true,
            msg: res.data.msg
          })
        }
      }
    })



  },

  // 选择支付方式
  handleFruitChange({
    detail = {}
  }) {
    this.setData({
      current: detail.value
    });
  },

  onClose() {
    this.setData({
      show: false,
      show1: false,
      show2: false
    });
  },

  //获取车位相信信息
  getcarlist(carid) {
    //获取车位详情
    wx.request({
      url: app.url + '/product/auth0/miniTruckSpace/' + carid,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          buyName = res.data.data.controlRespDto.buyName;
          this.setData({
            data: res.data.data,
            buyName: buyName
          })
          //项目开盘信息查询
          wx.request({
            method: 'post',
            url: app.url + '/project/auth0/miniProject/openDetail/' + this.data.data.projectId,
            header: {
              token: app.gettoken()
            },
            success: res => {
              if (res.data.code == 0) {
                let openStatus = res.data.data.openStatus
                let startTime = res.data.data.startTime
                this.setData({
                  openStatus,
                  startTime
                })

                if (openStatus == 0) {
                  this.gettime(startTime - app.newDate() - 1000)
                  settime1 = setInterval(_ => {
                    if (startTime - app.newDate() <= 1500) {

                      this.setData({
                        openStatus: 1,

                      })
                      clearInterval(settime1)
                    }
                    this.gettime(startTime - app.newDate() - 1000)

                  }, 1000)
                }
              }
            }
          })

        }
      }
    })
  },
  // 是否同意用户协议
  handleAnimalChange({
    detail = {}
  }) {
    this.setData({
      Agreement: detail.current
    });
  },
  goAgreement() { //跳转到用户认购协议
    wx.navigateTo({
      //落位type 1  认购type 2
      url: '/pages/order/Agreement/Agreement?projectId=' + this.data.data.projectId + "&type=2" + "&buyName=" + this.data.buyName,
    })

  },
  //添加收藏
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
  //格式化时间戳
  gettime: function(my_time) {
    var days = my_time / 1000 / 60 / 60 / 24;
    var daysRound = Math.floor(days);
    var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
    var hoursRound = Math.floor(hours);
    var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    var minutesRound = Math.floor(minutes);
    var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    this.setData({
      djs: [daysRound, hoursRound, minutesRound, Math.floor(seconds)]

    })
  },
  //返回选位大厅
  goHall() {
    wx.navigateBack({
      delta: 1
    });
  },
  change1() { //跳转到收藏
    wx.navigateTo({
      url: '/pages/opening/collection/collection?projectId=' + this.data.projectId,
    })
  },
})