// pages/project/Collection/Collection.js
var getTag = require('../../../utils/getTag.js') //引入车位标签
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '车位导购',
    })
    app.stopShare();
    //获取所有的筛选条件
    let projectId = wx.getStorageSync('dataid')
   
    getTag(projectId,this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   

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
  onShareAppMessage: function() {},
  //查看更多
  unfold() {
    this.setData({
      unfold: !this.data.unfold
    })
  },
  morescreen(e) {
    console.log(e)
    var title = e.currentTarget.dataset.title

    if (title == '区域') {
      console.log('这是区域')
      var index = e.currentTarget.dataset.index;
      var item = this.data.level1[index];
      item.isSelected = !item.isSelected;
      this.setData({
        level1: this.data.level1
      })
    } else if (title == '楼层') {

      var index = e.currentTarget.dataset.index;
      var item = this.data.level2[index];
      item.isSelected = !item.isSelected;
      this.setData({
        level2: this.data.level2
      })
    } else if (title == '楼栋') {
      var index = e.currentTarget.dataset.index;
      var item = this.data.level3[index];
      item.isSelected = !item.isSelected;
      this.setData({
        level3: this.data.level3
      })

    } else if (title == '更多筛选') {
      var tieleindex = e.currentTarget.dataset.tieleindex
      var index1 = e.currentTarget.dataset.index
      var item = this.data.taglist
      item[tieleindex].tagRespDtos[index1].isSelected = !item[tieleindex].tagRespDtos[index1].isSelected
      this.setData({
        taglist: item
      })

    }

  },
  //输入价格和面积
  maxArea(e) {
    console.log(e.detail.value)
    this.setData({
      maxArea: e.detail.value
    })
  },
  minArea(e) {
    console.log(e.detail.value)
    this.setData({
      minArea: e.detail.value
    })
  },
  minPrice(e) {
    console.log(e.detail.value)
    this.setData({
      minPrice: e.detail.value
    })
  },
  maxPrice(e) {
    console.log(e.detail.value)
    this.setData({
      maxPrice: e.detail.value
    })
  },
  //车位号名字
  carname(e){
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  //跳转到车位列表页面
  goParkinglist2() {
    var level1 = [] //区域id
    var level2 = [] //楼层id
    var level3 = [] //楼栋id
    let list1 = this.data.level1
    let list2 = this.data.level3
    let list3 = this.data.level2
    list1.map(i => {
      if (i.isSelected) {
        level1.push(i.id)
      }
    })
    list2.map(i => {
      if (i.isSelected) {
        level2.push(i.id)
      }
    })
    list3.map(i => {
      if (i.isSelected) {
        level3.push(i.id)
      }
    })
    console.log(level1, level2, level3)
    let list4 = this.data.taglist||[]
    let tagIds = [] //标签ID
    list4.map(i => {

      if (i.tagRespDtos) {
        i.tagRespDtos.map(i1 => {
          if (i1.isSelected) tagIds.push(i1.id)
        })
      }

    })
 
    let projectId= wx.getStorageSync('dataid')
    let data = {
      name: this.data.name,
      projectId,
      level1,
      level2,
      level3,
      tagIds,
      minPrice: this.data.minPrice,
      maxPrice: this.data.maxPrice,
      minArea: this.data.minArea,
      maxArea: this.data.maxArea,
      sortType: this.data.sortType
    }
    wx.setStorageSync('searchcriteria', data)
    wx.navigateTo({
      url: '/pages/project/Parkinglist2/Parkinglist2?projectId='+wx.getStorageSync('dataid'),
    })
  },
  //跳转到搜索结果
  goserchist(){
    if(this.data.name.length==0) return
    wx.navigateTo({
      url: '/pages/project/searchlist/searchlist?name=' + this.data.name + '&projectId=' + wx.getStorageSync('dataid'),
    })
  }
})