// pages/my/drop_code/drop_code.js
const app = getApp()
var time
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 2认购 1落位
    type:2
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e.type)
    wx.setNavigationBarTitle({
      title: '核销码',
    });
    this.setData({
      type: e.type
    })
    if (e.id) this.setData({
      orderFormId: e.id,
      userName: wx.getStorageSync('wx').nickName,
    })
    app.stopShare();
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
    //获取核销列表详情
    clearTimeout(time)
    wx.request({
      url: app.url + '/order/auth0/orderFormVerify/' + this.data.orderFormId,
      method: 'get',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            data: res.data.data,
            contractIdcard: res.data.data.contractIdcard,
            contractMobile: res.data.data.contractMobile,
            contractName: res.data.data.contractName
          })
        }
        this.getproject(res.data.data.truckSpace.projectId) //获取项目控制信息
        this.getPersonal(res.data.data.truckSpace.projectId) //获置业顾问信息
        this.settime() //循环调取是否核销

      }

    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log(121212121)
    clearTimeout(time)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(time)
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
  // 修改签约人信息

  onshow() {
    this.setData({
      show: true
    });
  },
  onClose() {
    //添加修改签约人信息

    wx.request({
      url: app.url + '/order/auth0/orderForm/updateContractInfoReqDto',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        truckSpaceId: this.data.data.truckSpaceId,
        contractIdcard: this.data.contractIdcard,
        contractMobile: this.data.contractMobile,
        contractName: this.data.contractName,
      },
      success: res => {
        if (res.data.code == 0) {
          this.onShow()
        }
      }
    })
    this.setData({
      show: false,

    });
  },
  onClose1() {
    this.setData({
      show1: false
    })
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
  //获取项目控制信息

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
            Project: res.data.data
          })
        }

      }
    })
  },
  //获取职业顾问详情
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
  //拨打职业顾问电话
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.consultantlist[0].phone,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
        projectId: this.data.data.truckSpace.projectId,
        consultantId: consultantId
      },
      success: res => {
        this.getPersonal(this.data.data.truckSpace.projectId)
      }
    })
  },
  //判断二维码是否被核销
  judgeCode(code) {
    wx.request({
      url: app.url + '/order/auth0/orderFormVerify/isVerify/' + code,
      method: 'get',
      header: {
        token: app.gettoken()
      },

      success: res => {
        if (res.data.code == 0) {
          if (res.data.data == true) {
            wx.showModal({
              title: '核销成功',
              content: '将为您跳转到个人中心',
              showCancel: false,
              success: () => {
                clearTimeout(time)
               wx.reLaunch({
                 url: '/pages/my/my/my',
               })
              }
            })
            clearTimeout(time)
          }
          else {
            this.settime()
          }
        } else if (res.data.code == -1) {
          wx.showModal({
            title: '二维码已过期',
            content: '点击重新刷新二维码',
            showCancel: false,
            success: () => {
              clearTimeout(time)
              wx.navigateBack({
                delta: 1
              })

            }
          })
        }
      }
    })
  },
  settime() {
    time = setTimeout(() => {

      this.judgeCode(this.data.data.verifyCode) //判断二维码是否被核销
    }, 1000)
  }
})