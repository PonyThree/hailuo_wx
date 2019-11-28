// pages/my/order/order.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index1:0,
    tabList:['进行中','已完成','已失效']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
    app.stopShare();
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
    this.getorderList(this.data.index1)
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
  choseNum(e){
    console.log(e.detail)
    let status = e.detail
    this.setData({
      index1:e.detail
    })
    this.getorderList(status)
  },
  // 点击标签时触发
  // click(e){
  //   console.log(e)
  //   let status = e.detail.index 
  //   this.setData({
  //     index: status
  //   })
  //   this.getorderList(status)
  // },
  //小程序获取订单列表
  getorderList(status){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.url + '/order/auth0/orderForm/list',
      method: 'post',
      header: {
        token: app.gettoken(),
    
      },
      data:{
        status: status
      },
      success: res => {
        wx.hideLoading()
          if(res.data.code==0){
            this.setData({
              data:res.data.data||[]
            })
          }
      }
    })
  },
  //去认购
  gobuy(e){
    console.log(e)
    let carid = e.currentTarget.dataset.carid
    let projectid = e.currentTarget.dataset.projectid
    let orderNo = e.currentTarget.dataset.orderno
    wx.navigateTo({
      url: '/pages/order/subscription/subscription?carid=' + carid + '&orderNo=' + orderNo
    })
  },
  //去核销
  gocontrol(e){
    let carid = e.currentTarget.dataset.carid
    let projectid = e.currentTarget.dataset.projectid
    let orderNo = e.currentTarget.dataset.orderno
    wx.navigateTo({
      url: '/pages/my/control/control'
    })},
  jump(e){
    console.log(e.currentTarget.dataset)
    let status = e.currentTarget.dataset.status
    let carid = e.currentTarget.dataset.carid
    let projectid = e.currentTarget.dataset.projectid
    let orderNo = e.currentTarget.dataset.orderno
    let simulate = e.currentTarget.dataset.simulate
    if (simulate==1){
      wx.showToast({
        title: '该订单为模拟开盘认购订单,无法查看',
        icon:'none'
      })
      return
    }
    if (status==1){  //去认购
      wx.navigateTo({
        url: '/pages/order/subscription/subscription?carid=' + carid + '&orderNo=' + orderNo
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/order/realpay/realpay?carid=' + carid + '&orderNo=' + orderNo
      })
    }

  },
  
  del(e){  //删除订单
    let status = e.currentTarget.dataset.status
    let orderNo = e.currentTarget.dataset.orderno
    if(status==1){
    wx.showToast({
      title: '订单还在进行中,请不要删除您的订单',
      icon:'none'

    })
    return
    }
    wx.request({
      url: app.url + '/order/auth0/orderForm/userDel/' + orderNo,
      method: 'get',
      header: {
        token: app.gettoken(),
      },
      success: res => {
        if (res.data.code == 0) {
          this.getorderList(this.data.index1)
          wx.showToast({
            title: '删除成功',
          })
        }
        else{
          wx.showToast({
            title:res.data.msg,
            icon:'none'
          })
        }
      }
    })

  },
  cancel(e){  //取消落位订单
    let orderNo = e.currentTarget.dataset.orderno
    wx.showModal({
      title: '是否取消该订单?',
      success:res=> {
        if (res.confirm) {
          wx.request({
            url: app.url + '/order/auth0/orderForm/cancel/' + orderNo,
            method: 'get',
            header: {
              token: app.gettoken(),
            },
            success: res => {
              if (res.data.code == 0) {
                this.getorderList(this.data.index1)
                wx.showToast({
                  title: '取消订单成功',
                })
              }
              else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        } 
      }
    })
    
   
    
  }

  // 1 待付认购金, 2 等待认购中, 3 落位失效(退款成功), 4 审核通过认购成功, 5 认购失效, 6 车位已购买, 7落位成功, 8 认购审核未审核 9 认购审核不通过, 10 用户取消 11 落位因单别人认购了而被取消 12 项目方取消
})