// pages/my/collection/collection.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    widHeight:'',
    currentTab: 0,
    checked: false,
    checked1: false,
    disabled: false,
    isChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我的收藏',
    });
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
    //获取用户收藏列表
    wx.request({
      url: app.url + '/product/auth0/truckSpace/collect',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data:{},
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            data: res.data.data,
            widHeight:res.data.data.length*400
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
  //点击切换 
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 多选
  handleChange(e) {
    console.log(e)
    this.setData({
      checked: e.currentTarget.id
    });
  },
  //单选
  handleChange1({
    detail = {}
  }) {
    this.setData({
      checked1: detail.current
    });
  },
  // 编辑点击事件
  btn: function() {
    var that = this
    if (that.data.isChecked == false) {
      this.setData({
        isChecked: true
      })
    } else {
      this.setData({
        isChecked: false
      })
    }
  },
  // 删除收藏
  del(e){
    console.log(e)
    let truckSpaceIds = [e.currentTarget.dataset.id] 
    wx.request({
      url: app.url + '/user/auth0/user/carNotCollect',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: truckSpaceIds,
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '取消收藏',
          })
          this.onShow()
        }
      }
    })
  },
  //跳转到车位详情
  goParkInfoOpened(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/firstPage/parkInfoOpened/parkInfoOpened?carid='+id,
    })
  },
  //回首页
  goindex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})