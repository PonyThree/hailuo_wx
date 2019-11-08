// pages/order/dropsuccess/dropsuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //认购订单弹出层
      show:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(this.data.show);
    if (e.orderNo) {
      this.setData({
        orderNo: e.orderNo || "201906183661498733171834881"
      })
    }

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
    //获取订单信息
    wx.request({
      url: app.url + '/order/auth0/orderForm/' + this.data.orderNo,
      method: 'get',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            orderlist: res.data.data
          })
          this.getcarlist(res.data.data.truckSpaceId) //获取车位详情
            this.setData({
                show: true
            })

        } else if (res.data.code != 15) {
              wx.showToast({
                title: '失败,请联系客服',
                icon: 'none'
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
  //返回首页
  goindex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //查看订单跳转到
  subscription() {
    wx.navigateTo({
      url: '/pages/order/realpay/realpay?orderNo=' + this.data.orderNo,
    })
  },
  // 获取车位详情
  getcarlist(id) {
    //获取车位详情
    wx.request({
      url: app.url + '/product/auth0/miniTruckSpace/' + id,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          // this.getproject(res.data.data.projectId)
          this.setData({
            data: res.data.data
          })
        }

      }
    })
  },
  //获取项目控制详情
  getproject(projectId) {
    wx.request({
      url: app.url + '/project/auth0/controll/selOneByProjectId',
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

          })
        }

      }
    })
  }
})