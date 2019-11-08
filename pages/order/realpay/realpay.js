// pages/order/drop/drop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: wx.getStorageSync('wx').nickName,
    Personal1: '0',
    fruit: [{
      id: 1,
      name: '钱包(￥)',
    }, {
      id: 2,
      name: '微信支付'
    }],
    current: '微信支付',
    position: 'right',
    time: app.newDate(),
    inputData: { // 输入框参数设置
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "98rpx",//输入框高度
      width: "604rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    if (e.orderNo) this.setData({ orderNo: e.orderNo })
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

    this.getorderlist() //获取订单详情


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
 
  // 顶部时间弹出
  showtimetop() {
    this.setData({
      showtimetop: !this.data.showtimetop
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
  // 修改签约人信息
  onshow() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  //修改签约人信息
  value2(e) {
    console.log(e)
    let value = e.detail.detail.value
    this.setData({
      contractName: value
    })
  },
  value3(e) {
    let value = e.detail.detail.value
    this.setData({
      contractMobile: value
    })
  },
  value4(e) {
    let value = e.detail.detail.value
    this.setData({
      contractIdcard: value
    })
  },

  //选择职业顾问
  onshow1() {
    this.setData({
      show1: true
    });
  },

  onClick(e) {
    console.log(e)
    this.setData({
      Personal1: e.currentTarget.dataset.name,
      Personalid: e.currentTarget.dataset.id,
      show1: false
    })
    this.bindPersonal(e.currentTarget.dataset.id)
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
  //获取订单信息
  getorderlist() {
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
            orderlist: res.data.data,
              contractName: res.data.data.contractName,
              contractMobile: res.data.data.contractMobile,
              contractIdcard: res.data.data.contractIdcard
          })
          this.getcarlist(res.data.data.truckSpaceId) //获取车位

        } else if (res.data.code != 15) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
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
          this.setData({
            data: res.data.data
          })
          this.getPersonal() //获取职业顾问信息

        }
      }
    })
  },
  // 弹起密码框
  valueSix(e) {
    console.log(e);
    // 模态交互效果
    this.setData({
      psw: e.detail,
      show2: false
    })
    wx.request({
      url: app.url + '/product/auth0/userChangeDownPay',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        truckSpaceId: this.data.data.id,
        payPassword: md5.hexMD5(this.data.psw)
      },
      success: res => {

        if (res.data.code == 0) {
          wx.navigateTo({
            url: '/pages/order/dropsuccess/dropsuccess?orderNo=' + res.data.data.orderNo,
          })
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
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

  },
  //拨打职业顾问电话
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.consultantlist[0].phone,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //绑定专属职业顾问
  bindPersonal(consultantId) {
    wx.request({
      url: app.url + '/project/auth0/projectUser/setConsultantForProjectUser',
      method: 'get',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        projectId: this.data.data.projectId,
        consultantId: consultantId
      },
      success: res => {
        this.getPersonal()
      }
    })
  },
  //返回首页
  goindex(){
    app.goindex()
  },
  //去核销列表
  gocontrol(){
    wx.navigateTo({
     url: "/pages/my/control/control"
    })
  }
})