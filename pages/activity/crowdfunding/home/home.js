// pages/crowdfunding/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 众筹成功
    successData: {
      message: "恭喜您活动成功，去领奖励吧！",
      type: "success",
    },
    // 未开始
    noStartData: {
      message: "距活动开始",
      activityTime: "2019 12 30 18:00",
      type: "about",
    },
    // 进行中
    aboutData: {
      message: "距活动结束",
      type: "about",
      activityTime: "2019 12 31 18:00"
    },
    // 众筹失败
    errorData: {
      message: "该活动未能按时凑齐人数，众筹失败下次加油吧",
      type: "error",
    },
    // 当前组件状态
    currentStatusData: {
      message: "距活动开始",
      activityTime: "2019 12 30 18:00",
      type: "about",
    },
    activityStatus: "end-error", //未开始notStart  进行中proceed    结束end-success end-error
    scheduleStatus: false, //多目标 true  少目标 false
    percent: "55", //进度
    infoWindowBool: false, //参与成功提示弹窗
    activityBtnLoading: false, //按钮loading
    payWindowBool: false //缴费提示窗口
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 关闭弹窗
   */
  clearWindow(e) {
    console.log();
    switch (e.target.dataset.tag) {
      case "pay":
        this.setData({
          payWindowBool: false
        })
        break;
      case "info":
        this.setData({
          infoWindowBool: false
        })
        break;
      default:
        break;
    }

  },
  /**
   * 加入活动
   */
  addActivity() {
    this.setData({
      activityBtnLoading: true
    })


    setTimeout(() => {
      this.setData({
        activityBtnLoading: false,
        payWindowBool: true
      })
    }, 2000);
  },
  /**
   * 领取奖励
   */
  getAward() {},

  /**
   * 去支付
   */
  pay() {
    this.setData({
      infoWindowBool: true,
      payWindowBool: false
    })
  },
  /**
   * 暂时不了
   */
  refuse() {
    this.setData({
      payWindowBool: false
    })
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

  },





  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})