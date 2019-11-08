// pages/firstPage/chooseParkingA/chooseParkingA.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    showRight2: false,
    showRight1: false,
    hasMask: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad(e){
    console.log(e)
    if(e.name) this.setData({name:e.name})
    if (e.projectId) this.setData({ projectId: e.projectId})
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //获取所有的筛选条件
    let projectId = this.data.projectId
   
    //条件查询车位列表
    wx.request({
      url: app.url + '/product/auth0/truckSpace/conditionSearch',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        pageSize:0,
        projectId,
          name:this.data.name
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            carlist: res.data.data
          })

        }
      }
    }),
    //项目基本信息查询
      wx.request({
      url: app.url + '/project/auth0/miniProject/miniProjectInfo?projectId=' + projectId,
        method: 'post',
        header: {
          token: app.gettoken()
        },
      
        success: res => {
          if (res.data.code == 0) {
            this.setData({
              ProjectInfo:res.data.data
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // console.log('用户下拉了');
    // this.setData({
    //     show: true
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  // 滑动固定头部
  bindscroll(e) {
    let top = e.detail.scrollTop
    if (top >= 120) {
      this.setData({
        scrolltop: true
      })
    } else {
      this.setData({
        scrolltop: false
      })
    }
  },

  //跳转到车位详情
  goCarDetails(e) {
    let carid = e.currentTarget.dataset.carid
    wx.navigateTo({
      url: '/pages/firstPage/parkInfoOpened/parkInfoOpened?carid=' + carid,
    });
  },

  //滚动开始
  touchstart(){
    this.setData({
      show:true
    })
  },
  //滚动结束
  touchend(){
    this.setData({
      show:false
    })
  },
  previewImage(e){
    console.log(e)
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
  }
})