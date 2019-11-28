// pages/project/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '车位',
    list: wx.getStorageSync('serchList'),

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  // 点击下拉出现dorp
  dorp() {
    this.setData({
      show: !this.data.show
    })
  },
  // 跳转到车位搜索 
  gocar() {
    this.setData({
      radio: "车位",
      show: !this.data.show
    })
  },
  //小区搜索
  goproject() {
    this.setData({
      radio: "小区",
      show: !this.data.show
    })
  },
  //搜索内容
  search(e) {
    let list = wx.getStorageSync('serchList') || []
    let value = e.detail.value
    if (value.length == 0) return
    if (this.data.radio == '小区') {
      wx.navigateTo({
        url: '/pages/project/Allflats/Allflats?projectName=' + value,
      })
      let serch = {
        type: 1,
        value
      }
      list.push(serch)
      this.setData({
        list: list
      })
      wx.setStorageSync('serchList', list)


    } else {
      let list = wx.getStorageSync('serchList1') || []
      let value = e.detail.value
      if (this.data.radio == '车位') {
        let serch = {
          type: 2,
          value
        }
        wx.navigateTo({
          url: '/pages/project/searchlist/searchlist?name=' + value + '&projectId=' + wx.getStorageSync('dataid'),
        })
        list.push(serch)
        this.setData({
          list1: list
        })
        wx.setStorageSync('serchList1', list)
        console.log(list)
      }
    }
  },
  // 清除历史搜索记录
  clear() {

    wx.removeStorageSync('serchList1')
    wx.removeStorageSync('serchList')
    this.setData({
      list: [],
      list1: [],
    })


  },
  listsearch(e) {
    console.log(e)
    let type = e.target.dataset.type
    let name = e.target.dataset.name
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/project/Allflats/Allflats?projectName=' + name,
      })
    } else {
      wx.navigateTo({
        url: '/pages/project/searchlist/searchlist?name=' + name + '&projectId=' + wx.getStorageSync('dataid'),
      })
    }

  }
})