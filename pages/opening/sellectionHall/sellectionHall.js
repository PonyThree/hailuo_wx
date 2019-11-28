var app = getApp();
var timer;
var nowTime;
var getTag = require('../../../utils/getTag.js') //引入车位标签
var searhlist = require('../../../utils/serch.js') //引入车位标签
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topNum:0,
    pageSize:1,
    onlySelling: 0,
    // 开盘倒计时 0未开盘 1已开盘 2已过期
    openStatus: '',
    projectName: '',
    //开盘时间
    startTime: '',
    countDown: '',
    //开盘倒计时
    msg: '',
    currentId:2
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      projectId: e.projectId
    })
    app.stopShare();
    this.renderTime();

    let searchcriteria = wx.getStorageSync('searchcriteria')
    searchcriteria.pageSize = 1
    this.setData({
      projectId: e.projectId,
      searchcriteria: searchcriteria
    })
    let projectId = this.data.projectId
    //条件查询车位列表
    wx.request({
      url: app.url + '/product/auth0/truckSpace/conditionSearch',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: this.data.searchcriteria || {
        projectId: this.data.projectId
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 0) {
          this.setData({
            carlist: res.data.data,
            serchActivty: 0
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(timer);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    setTimeout(() => {
      app.stopre()
    }, 1000)
    this.setData({
      pageSize: 1
    })
    let data = this.data.searchcriteria
    data.pageSize = this.data.pageSize
  searhlist(data,true,this)

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  tip() { //点击加载更多
    this.bindscrolltolower()
  },
  bindscrolltolower() {//滚动到底部
    if (this.data.carlist.hasData == false) {
      this.setData({
        tip: true
      })
      return
    }
    this.setData({
      showloding: true,
      pageSize: this.data.pageSize += 1
    })
    wx.showLoading({
      title: '加载中',
    })
    let data = this.data.searchcriteria
    data.pageSize = this.data.pageSize
    searhlist(data, false, this)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  // 收藏跳转
  change1() {
    wx.navigateTo({
      url: '/pages/opening/collection/collection?projectId=' + this.data.projectId,
    })
  },

  // 跳转到真实开盘出价页面
  gobid(e) {
    clearInterval(timer);
    console.log(e)
    if (e.currentTarget.dataset.sellstatus == 2 || e.currentTarget.dataset.sellstatus == 3) {
      wx.showToast({
        title: '车位已售出',
        icon: 'none'
      })
      return
    }
    var id = e.currentTarget.dataset.carid;
    wx.navigateTo({
      url: '/pages/opening/bid/bid?carid=' + id 
    })
  },


  addZero(n) {
    return n < 10 ? '0' + n : n;
  },
  // 时间戳转时间函数
  transformDate(time) {
    var t = new Date(time);
    var y = t.getFullYear();
    var mon = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    return y + '-' + this.addZero(mon) + '-' + this.addZero(d) + " " + this.addZero(h) + ":" + this.addZero(m) + ":" + this.addZero(s);
  },
  cutDownDate(time) {
    if (time == 0) {
      this.data.openStatus = 1;
      return;
    }
    var d = Math.floor(time / 1000 / 60 / 60 / 24);
    var hour = Math.floor(time / 1000 / 60 / 60 % 24);
    var min = Math.floor(time / 1000 / 60 % 60);
    var sec = Math.floor(time / 1000 % 60);
    return d + '天' + hour + "小时" + min + "分" + sec + "秒";
  },
  //头部时间数据
  renderTime() {
    var that = this;
    clearInterval(timer)
    wx.request({
      method: 'post',
      url: app.url + '/project/auth0/miniProject/openDetail/' + this.data.projectId,
      header: {
        token: app.gettoken()
      },
      success: res => {
        //开盘时间
        var openStartTime = that.transformDate(res.data.data.startTime);
        nowTime = app.newDate();
        that.setData({
          openStatus: res.data.data.openStatus,
          startTime: openStartTime,
          projectName: res.data.data.projectName,
          msg: that.cutDownDate(res.data.data.startTime - nowTime)
        });
        //倒计时 countDown
        nowTime = app.newDate();
        let countDown = res.data.data.startTime - nowTime;
        that.data.countDown = countDown;
        if (this.data.openStatus == 0) {
          timer = setInterval(() => {
            var msg = this.cutDownDate(that.data.countDown -= 1000)
            if (that.data.countDown <= 0) { //倒计时结束重新加载页面
              clearInterval(timer)
              this.setData({
                openStatus: 1
              })
            }
            this.setData({
              msg: msg
            });
          }, 1000);
        }
      }
    })
  },

 
  Reload() { //重新加载.
    this.setData({
      topNum:0
    })
    wx.showLoading({
      title: '加载中',
    })
    let data = this.data.searchcriteria
    data.pageSize=1
    this.setData({
      pageSize:1
    })
    searhlist(data, true, this)
  
  },
  refreshChose(e) { // 重选楼栋

    wx.redirectTo({
      url: `/pages/project/selection/selection?projectId=${ this.data.projectId}&from=zskp` 
    })
    wx.removeStorageSync('searchcriteria')
  },
  screen(e) { //可选筛选
    wx.showLoading({
      title: '加载中',
    })
    let type = e.currentTarget.dataset.id
    let data = this.data.searchcriteria || {
      projectId: this.data.projectId,

    }
    this.setData({
      currentId: type
    })
    data.pageSize = 1
    data.onlySelling = type
    this.setData({
      searchcriteria: data,
      pageSize: 1
    })
    searhlist(data, true, this)
  },
  handlesearch(e) { //搜索车位
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageSize: 1
    })
    let name = e.detail.searchValue
    let data = wx.getStorageSync('searchcriteria')
    data.name = name
    data.pageSize = this.data.pageSize
    this.setData({
      searchcriteria: data
    })
    searhlist(data, true, this)

  },
 
})