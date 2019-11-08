// pages/project/Allflats/Allflats.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allproject: [],
    //滑动数据
    swiper: {
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取携带过来的项目名字
    if (options.projectName){
      this.setData({
        projectName: options.projectName
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //省份查询
    wx.request({
      url: app.url + '/project/sysRegion/select',
      header: {
        token: app.gettoken()
      },
      data: {
        parentId: '0'
      },
      success: res => {

        if (res.data.code == 0) {
          this.setData({
            list: res.data.data
          })
        }
      }
    })
    //获取热门城市
    wx.request({
      url: app.url + '/project/auth0/project/getHotCity',
      header: {
        token: app.gettoken()
      },
      method:'post',
      data: {
      },
      success: res => {

        if (res.data.code == 0) {
        this.setData({
          HotCity:res.data.data
        })
        }
      }
    })
    //条件查询所有楼盘
    this.corfim()
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
  //去项目首页
  goprojectIndex() {
    wx.navigateTo({
      url: '/pages/firstPage/projectIndex/projectIndex',
    })
  },
  // 筛选抽屉1
  toggleRight1() {
    this.setData({
      showRight1: !this.data.showRight1,
      hasMask: !this.data.hasMask
    })
  },
  toggleRight2() {
    this.setData({
      showRight2: !this.data.showRight2,
      hasMask: !this.data.hasMask
    })
  },
  toggleRight3() {
    this.setData({
      showRight3: !this.data.showRight3,
      hasMask: !this.data.hasMask
    })
  },
  close() {
    this.setData({
      showRight1: false,
      showRight2: false,
      showRight3: false
    })
  },
  // 选中
  Selection() {
    console.log(123)
  },
  // 关闭
  onClose() {
    this.setData({
      showRight3: !this.data.showRight3,
      hasMask: !this.data.hasMask,
      swiper: {
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        current: 0,
      },

    })
  },
  // 热门城市
  ProvinceClick3(e) {
    //市查询
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.url + '/project/sysRegion/select',
      header: {
        token: app.gettoken()
      },
      data: {
        parentId: id
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            list2: res.data.data,

          })
        }
      }
    })

    var swiper = this.data.swiper;
    var current = swiper.current;

    swiper.current = current < 2 ? current + 2 : 0;
    this.setData({
      swiper: swiper,
      current: []
    })
  },
  // 省份点击
  ProvinceClick(e) {
    //市查询
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.url + '/project/sysRegion/select',
      header: {
        token: app.gettoken()
      },
      data: {
        parentId: id
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            list1: res.data.data,
         
          })
        }
      }
    })

    var swiper = this.data.swiper;
    var current = swiper.current;

    swiper.current = current < 2 ? current + 1 : 0;
    this.setData({
      swiper: swiper,
      current: []
    })
  },
  // 市点击
  ProvinceClick1(e) {
    //区域查询
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.url + '/project/sysRegion/select',
      header: {
        token: app.gettoken()
      },
      data: {
        parentId: id
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            list2: res.data.data
          })
        }
      }
    })

    var swiper = this.data.swiper;
    var current = swiper.current;

    swiper.current = current < 2 ? current + 1 : 0;
    this.setData({
      swiper: swiper,
      current: []
    })
  },
  // 区域点击
  ProvinceClick2(e) {

    var id = e.currentTarget.dataset.id
   this.setData({
     listId:id
   })
   this.corfim()
    var swiper = this.data.swiper;
    var current = swiper.current;

    swiper.current = current < 2 ? current + 1 : 0;
    this.toggleRight3()
    this.setData({
      swiper: swiper,
      current: []
    })
  },
  //---------------------------------------------
  // 排序筛选
  sortscreen(e) {
    var sortid = e.currentTarget.dataset.id
    let sort = this.data.sort
    //如果没有选择
    this.setData({
      sortType: sortid
    })
  },
  //价格筛选
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
  //条件提交
  corfim() {
    //条件查询所有楼盘
    wx.showLoading({
      title: '搜索中',
    })
    wx.request({
      url: app.url + '/project/auth0/project/selAllProject',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        "higMoney": this.data.maxPrice,
        "listId": this.data.listId,
        "lowMoney": this.data.minPrice,
        "timeLimit": this.data.sortType,
        projectName: this.data.projectName,
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 0) {
          this.setData({
            allproject: res.data.data || [],
            showRight2: false,
            showRight1: false,

          })
          
        }
      }
    })
  },
  //搜索确定
  serch(e) {
    this.setData({
      projectName: e.detail.value
    })
    this.corfim()
  }

})