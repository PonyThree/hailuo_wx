const app = getApp();
var getTag = require('../../../utils/getTag.js') //引入车位标签
var searhlist = require('../../../utils/serch.js') //引入车位标签
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId: '',
    pageSize: 1,
    currentId: 2

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      projectId: e.projectId
    })
    app.stopShare();
    // this.renderTime();

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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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





  renderData() {
    wx.request({
      method: 'post',
      url: app.url + '/product/auth0/truckSpace/simulatedOpen',
      header: {
        token: app.gettoken(),
        "content-type": 'application/json'
      },
      data: {
        'projectId': this.data.projectId,
        'pageSize': this.data.pageSize
      },
      success: res => {
        console.log(res.data.data);
        // this.choose();
        this.setData({
          parkList: res.data.data,
        })
      }
    })
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
    searhlist(data, true, this)


  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  },
  // 收藏跳转
  change1() {
    wx.navigateTo({
      url: '/pages/simulatedOpen/collection/collection?projectId=' + this.data.projectId,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  tip() { //点击加载更多
    this.bindscrolltolower()
  },
  bindscrolltolower() { //滚动到底部
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
  setstatus() { //子组件倒计时结束调用修改状态  
    this.setData({
      setstatus: true
    })
  },
  // 跳转到真实开盘出价页面
  gobid(e) {
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
  Reload() { //重新加载.
    this.setData({
      topNum: 0
    })
    wx.showLoading({
      title: '加载中',
    })
    let data = this.data.searchcriteria
    data.pageSize = 1
    this.setData({
      pageSize: 1
    })
    searhlist(data, true, this)
  },
  refreshChose(e) { // 重选楼栋
    wx.redirectTo({
      url: `/pages/project/selection/selection?projectId=${this.data.projectId}&from=mnkp`
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