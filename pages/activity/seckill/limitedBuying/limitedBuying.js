// pages/activity/seckill/limitedBuying/limitedBuying.js

var timer
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 时间状态切换
    type: 0,
    // 销售状态 true在售 false已售
    status: 1,
    //规则弹出层
    showRegular: false,
    scrollTop:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    // console.log(e)
    if (e.projectId) {
      this.setData({
        projectId: e.projectId
      })
      wx.showLoading({
        title: '加载中',
      })

      
    }

    wx.setNavigationBarTitle({
      title: '限时秒杀',
    })
    wx.request({ //获取活动图片
      url: app.url + '/activity/auth0/activityImage/getImg',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'get',
      data: {
        projectId: this.data.projectId
      },
      success: res => {
        console.log(res)
        if (res.statusCode == 200) {
          this.setData({
            activityImg: res.data
          })


        }
      }
    })
    this.getActivityRule(this.data.projectId) //获取活动规则
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onPageScroll(e){
      this.setData({
          scrollTop:e.scrollTop
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    wx.request({ //获取活动头部列表
      url: app.url + '/activity/auth0/activityTab/getListData',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        actType: 1,
        projectId: this.data.projectId
      },
      success: res => {
        if (res.data.code == 0 && res.data.data.length > 0) {
          this.setData({
            topList: res.data.data,
            actid: res.data.data[this.data.type].id
          })
          this.getCarlist(this.data.actid, this.data.projectId) //获取车位列表
        } else {
          wx.hideLoading()
          this.setData({
            topList: [],

          })
        }
      }
    })

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
  //自带分享
  onShareAppMessage: function (e) {

    var url = `/pages/activity/seckill/limitedBuying/limitedBuying?projectId=${this.data.projectId}`;
    console.log(url)
    return {
      title: '限时秒杀, 手慢无!',
      desc: '北城天街',
      path: url
    }
  },
  // 分享活动
  shareAc() {
    this.onShareAppMessage();
    wx.request({
      url: app.url + '/activity/auth0/activityTab/addSharesNub',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        actId: this.data.actid,

      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading()
    this.onShow()
    setTimeout(() => {
      app.stopre()
    }, 1000)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
 
  //开盘时间切换
  changeItem(e) {
    wx.showLoading({
      title: '加载中',
    })
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.actid;
    this.getCarlist(id, this.data.projectId)
    this.setData({
      type
    })
  },
  //查看规则
  showRegular() {
    this.setData({
      showRegular: true
    })
  },
  //关闭规则弹窗
  onClose() {
    this.setData({
      showRegular: false
    })
  },
  // 我知道了
  close() {
    this.onClose();
  },
  
  getCarlist(id, projectId) { //根据活动ID获取车位列表
    this.setData({
      actid: id,
      projectId: projectId
    })
    wx.request({
      url: app.url + '/product/auth0/activityTruckSpace/getWxList',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'get',
      data: {
        actType: 1,
        actId: id,
        projectId:this.data.projectId
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 0) {
          clearInterval(timer)
          this.setData({
            carList: res.data.data
          })
          if (this.data.carList.actStatus == 2) { //未开盘
            let my_time = this.data.carList.staTime - app.newDate()
            this.gettime(my_time)
            timer = setInterval(_ => {
              this.gettime(my_time -= 1000)
              if (my_time <= 1000) {
                console.log(1212)
                clearInterval(timer)
                this.setData({
                  [`topList[${this.data.type}].actStatus`]: 1,
                  [`carList.actStatus`]: '0'
                })
                return
              }
            }, 1000)
          } else if (this.data.carList.actStatus == 1) { //已开盘
            let my_time = this.data.carList.endTime - app.newDate()
            this.gettime(my_time)
            timer = setInterval(_ => {
              this.gettime(my_time -= 1000)
              if (my_time <= 1000) {
                clearInterval(timer)
                this.setData({
                  [`topList[${this.data.type}].actStatus`]: 1,
                  [`carList.actStatus`]: '0'
                })
              }
            }, 1000)
          }
        }
      }
    })
  },
  getActivityRule(projectId) { //获取活动规则
    wx.request({
      url: app.url + '/activity/auth0/activityRule/getData',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        actType: 1,
        projectId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            activityRule: res.data.data
          })
        }
      }
    })

  },
  Reserve(e) { //活动车位预约
      wx.showLoading({
        title: '加载中',
      })
    let carid = e.currentTarget.dataset.carid
    let type = e.currentTarget.dataset.type
  
    wx.request({
      url: app.url + '/product/activityReservaTable/ActivityReservaReqDto',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        actId: this.data.actid,
        projectId: this.data.projectId,
        truckSpaceId: carid,
        type,
        fromId:this.data.formId
      },
      success: res => {
        this.getCarlist(this.data.actid, this.data.projectId)
        if (type==1) {
          wx.showToast({
            title: '预约成功',
          })
        }
        else{
          wx.showToast({
            title: '取消预约',
            icon:'erro'
          })
        }
      }
    })
  },
  goCarDetail(e) { //跳转到车位详情
    let carid = e.currentTarget.dataset.carid
    wx.navigateTo({
      url: '/pages/firstPage/parkInfoOpened/parkInfoOpened?carid=' + carid,
    })
  },

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
  goindex() {
    app.goindex()
  },
  registerFormSubmit(res){ //获取fromId发送模板消息
   this.setData({
     formId: res.detail.formId
   })
  }

})