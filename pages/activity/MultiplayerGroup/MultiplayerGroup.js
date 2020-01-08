// pages/activity/MultiplayerGroup/MultiplayerGroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    // 是否已经参团或者创团
    hasJoinGroup:true,
    showRegular:false,
    // 更多参团人弹窗
    moreMulPerson:false,
    // 更多人1 团2
    type:1,
    joinSuc:false,
    canMove:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '多人拼团',
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '多人拼团',
      path: '/pages/activity/MultiplayerGroup/MultiplayerGroup'
    }
  },
  // 创建团
  buildGroup(){
    this.setData({
      joinSuc:true
    })
  },
  onClose2(){
    this.setData({
      joinSuc:false
    })
  },
  // 活动车位
  goActParking(){
    wx.navigateTo({
      url: '/pages/project/Parkinglist2/Parkinglist2',
    })
  },
  // 活动规则
  seeRegular(){
    this.setData({
      showRegular:true
    })
  },
  onClose(){
    this.setData({
      showRegular:false
    })
  }, 

  // 参团
  joinGroup(){
    console.log('去参团')
    wx.navigateTo({
      url: '/pages/activity/MultiplayerGroup/groupDetails/groupDetails',
    })
  },
  // 查看更多的参团人员
  readMoreUser(){
    this.setData({
      moreMulPerson:true,
      type:1,
    })
  },
  onClose1(){
    this.setData({
      moreMulPerson: false,
      moreUser:false,
      moreGroup:false
    })
  },
  // upper(e) {
  //   console.log(e)
  // },

  // lower(e) {
  //   console.log(e)
  // },

  scroll(e) {
    console.log(e.detail.scrollTop)
    // var distance = e.detail.scrollTop
    // if (distance > 0 && distance<314){
    // }else{
    //   wx.showLoading({
    //     title: '加载完毕了',
    //   })
    //   setTimeout(()=>{
    //     wx.hideLoading()
    //   },400)
    // }
  },
  // 查看更多
  findMore(){
    this.setData({
      moreMulPerson:true,
      type:2
    })
  }
})