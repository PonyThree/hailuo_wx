// pages/project/msg/msg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actions: [{
      name: '删除',
      color: '#ffffff',
      fontsize: '20',
      width: 120,
      icon: 'delete',
      background: 'red'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '消息',
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
    //获取消息列表详情
    wx.request({
      url: app.url + '/user/auth0/userMsgTab/getListData',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {

        if (res.data.code == 0) {
          this.setData({
            list: res.data.data||[]
          })
        }
        else{
          this.setData({
            list:[]
          })
        }
      }
    })
    this.getNotRede() //获取消息未读条数
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
  // 跳转详情页面
  jump(e) {
    console.log(e)
    let url = `projectname=${e.currentTarget.dataset.projectname}&msg=${e.currentTarget.dataset.msg}&projectId=${e.currentTarget.dataset.projectid}&id=${e.currentTarget.dataset.id}`
    wx.navigateTo({
      url: '/pages/project/msg_details/msg_details?' + url,
    })
  },
  //删除消息
  del(e) {
    console.log(e)
    let id = e.currentTarget.id
    //获取消息列表详情
    wx.request({
      url: app.url + '/user/auth0/userMsgTab/delData?id=' + id,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.onShow()
        }
      }
    })
  },
  //获取未读消息条数
  getNotRede() {
    //获取首页消息
    wx.request({
      url: app.url + '/user/auth0/userMsgTab/getNotRede',
      header: {
        token: app.gettoken()
      },
      method: 'post',
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data > 0) {
            wx.setTabBarBadge({
              index: 2,
              text: res.data.data.toString()
            })
          } else {
            //移除tabbar角标
            wx.removeTabBarBadge({
              index: 2,
            })
          }
        }
      }
    })

  }
})