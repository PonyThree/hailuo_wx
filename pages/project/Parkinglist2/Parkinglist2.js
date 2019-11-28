// pages/firstPage/chooseParkingA/chooseParkingA.js
var getTag = require('../../../utils/getTag.js') //引入车位标签
var searhlist = require('../../../utils/serch.js') //引入车位标签
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortType: 1,
    showRight2: false,
    showRight1: false,
    hasMask: false,
    pageSize: 1,
    SwitchList: 1,
    back: true,
    home: true,
    currentId:'2',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    wx.showLoading({
      title: '列表加载中.',
      mask: true
    })
    let searchcriteria = wx.getStorageSync('searchcriteria')
    searchcriteria.pageSize=1
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
    //获取所有的筛选条件
    getTag(projectId, this)
    //项目基本信息查询
    wx.request({
      url: app.url + '/project/auth0/miniProject/miniProjectInfo?projectId=' + this.data.projectId,
      method: 'post',
      header: {
        token: app.gettoken()
      },

      success: res => {
        if (res.data.code == 0) {
          this.setData({
            ProjectInfo: res.data.data
          })
        }
      }
    })
  },
  changeShow() {
    let SwitchList = this.data.SwitchList;
    if (SwitchList < 3) {
      SwitchList += 1
    
    } else {
      SwitchList = 1
    }

    this.setData({
      SwitchList
    })
  },
  gotop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  sort() { //排序筛选
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.sortType == 1) {
      this.setData({
        sortType: 2
      })
      this.corfim()
    } else {
      this.setData({
        sortType: 1
      })
      this.corfim()
    }

  },
  moreSelect() {  //选择楼栋
    this.setData({
      showRight1: !this.data.showRight1,
      hasMask: !this.data.hasMask
    })
  },

  // 更多筛选 抽屉1
  toggleRight1() {
    this.setData({
      showRight1: !this.data.showRight1,
      hasMask: !this.data.hasMask
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
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    setTimeout((() => {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }), 1000)
    this.setData({
      pageSize: 1
    })
    let data = this.data.searchcriteria || {
      projectId: this.data.projectId
    }
    data.pageSize = this.data.pageSize
    searhlist(data, true, this)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
   
    if (this.data.carlist.hasData==false) {
      this.setData({
        tip: true
      })
      return
    }

    this.setData({
      showloding: true,
      pageSize: this.data.pageSize += 1
    })
    let data = this.data.searchcriteria || {
      projectId: this.data.projectId
    }
    data.pageSize = this.data.pageSize
    
    searhlist(data, false, this)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  //跳转到车位详情
  goCarDetails(e) {

    let carid = e.currentTarget.dataset.carid
    wx.navigateTo({
      url: '/pages/firstPage/parkInfoOpened/parkInfoOpened?carid=' + carid,
    });
  },
  // -------------------------------------------------------------------------

  //更多筛选
  morescreen(e) {
   
    var title = e.currentTarget.dataset.title
      if (title == '更多筛选') {
      var tieleindex = e.currentTarget.dataset.tieleindex
      var index1 = e.currentTarget.dataset.index
      var item = this.data.taglist
      item[tieleindex].tagRespDtos[index1].isSelected = !item[tieleindex].tagRespDtos[index1].isSelected
      this.setData({
        taglist: item
      })
    }
  },
  //提交更多筛选
  corfim(e) {
    var list4=[]
    var tagIds=[]
    try{
      if (e.detail) { //子组件传递的方法
        list4 = e.detail || []
        //标签ID
      }}
      catch(err){ 
      }
    list4.map(i => {
      if (i.tagRespDtos) {
        i.tagRespDtos.map(i1 => {
          if (i1.isSelected) tagIds.push(i1.id)
        })
      }
    })
    this.setData({
      pageSize:1
    })
    let data = wx.getStorageSync('searchcriteria')
    data.minPrice = this.data.minPrice,
      data.maxPrice = this.data.maxPrice,
      data.minArea = this.data.minArea,
      data.maxArea = this.data.maxArea,
      data.sortType = this.data.sortType,
      data.onlySelling = 0,
      data.pageSize=this.data.pageSize,
      data.tagIds = tagIds
    this.setData({
      searchcriteria: data,
      showRight1: false,
      pageSize: 1
    })
    searhlist(data, true, this)
    wx.pageScrollTo({ //回到顶部
      scrollTop: 0
    })
  },
  previewImage(e) {
    
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
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
        currentId:type
    })
    data.pageSize = 1
    data.onlySelling = type
    this.setData({
      searchcriteria: data,
      pageSize:1
    })
    searhlist(data, true, this)
  },
  handlesearch(e) { //搜索车位
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageSize:1
    })
    let name = e.detail.searchValue
    let data = wx.getStorageSync('searchcriteria')
    data.name=name
    data.pageSize=this.data.pageSize
    this.setData({
      searchcriteria: data
    })
    searhlist(data, true, this)

  },
  activitySerch(e) { //秒杀筛选

    wx.showLoading({
      title: '加载中',
    })
    let type = e.currentTarget.dataset.type
    let data = this.data.searchcriteria || {
      projectId: this.data.projectId,
    }
    data.pageSize = 1
    data.activitySearchType = '1'
    searhlist(data, true, this)
    this.setData({
      searchcriteria: data,
      serchActivty: 2
    })

  },
  whole() { //点击全部车位
    wx.showLoading({
      title: '加载中',
    })
    let data = wx.getStorageSync('searchcriteria')
    console.log(data)
    data.pageSize=1
    this.setData({
      pageSize:1,
      searchcriteria:data
    })

    wx.request({
      url: app.url + '/product/auth0/truckSpace/conditionSearch',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: data,
      success: res => {
        wx.hideLoading()
        if (res.data.code == 0) {
          this.setData({
            carlist: res.data.data,
            tip: false,
            serchActivty: 0
          })
        }
      }
    })
  },
  tip() { //点击加载更多
    this.onReachBottom()
  },
  goprojectIndex() {
 
    wx.switchTab({
        url: '/pages/firstPage/projectIndex/projectIndex',
    })
  },
  goBack(e) { 
    wx.switchTab({
        url: '/pages/firstPage/projectIndex/projectIndex',
    })
  },
  refreshChose(e) { // 重选楼栋
    
      wx.reLaunch({
          url: '/pages/project/selection/selection?projectId=' + this.data.projectId
      })
    wx.removeStorageSync('searchcriteria')
  },
  doNotMove(){
    console.log('112121')
    return
  }

})