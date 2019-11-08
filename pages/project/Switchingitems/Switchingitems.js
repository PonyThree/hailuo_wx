// pages/project/Switchingitems/Switchingitems.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more: 3,
    moretext:'查看更多 >'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      if(options.from=='projectList'){
          this.scanCode()
      }
    wx.setNavigationBarTitle({
      title: "切换项目"
    })
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
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
    // 合作项目列表
    wx.request({
      url: app.url + '/project/auth0/selProjectInfoByUser',
      header: {
        token: app.gettoken()
      },
      success: res => {

        if (res.data.code == 0) {
          this.setData({
            ProjectInfoByUser: res.data.data||[]
          })
        }
      }
    })
    //调取获取位置系统
    this.getLocation()

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
  // 根据精度获取位置
  getLocation: function() {
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {

        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          url: app.url + '/project/auth0/selProjectByPosition',
          header: {
            token: app.gettoken(),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            lng: longitude,
            lat: latitude
          },
          success: res => {
            if (res.data.code == 0) {
              _this.setData({
                positionList: res.data.data
              })
            }
          }
        })
      }
    })

  },
  //扫一扫添加项目
  scanCode() {
    wx.scanCode({
      success: res => {
        let id = res.result
        console.log(id.substring(id.indexOf('=')+1))
        id = id.substring(id.indexOf('=') + 1)
        console.log(id)
        wx.request({
          url: app.url + '/user/userProject/auth0/addProjectForUser',
          header: {
            token: app.gettoken(),
          },
          method: "post",
          data: {
            projectId: id
          },
          success: res => {
            if (res.data.code == 0) {
              wx.setStorageSync('dataid', id)
              this.choice(1,wx.getStorageSync('dataid')) //扫码成功直接切换项目
            }
            else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          }
        })
      }
    })
  },
  //删除添加项目
  del(e) {
    console.log(e)
    if (e.currentTarget.dataset.status==true){
      wx.showToast({
        title: '不能删除选中项目',
        icon:'none'
      })
      return
    }
    let id = e.currentTarget.dataset.id
    wx.request({
      url: app.url + '/user/userProject/auth0/delProjectForUser',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      data: {
        projectId: id
      },
      success: res => {
        if (res.data.code == 0) {
          this.onShow()
          // wx.showToast({
          //   title: "添加楼盘成功"
          // })
        }
      }
    })
  },
  //切换添加项目
  choice(e,projectId) {
    let id = projectId|| e.currentTarget.dataset.id 
    console.log(id)
    wx.request({
      url: app.url + '/user/userProject/auth0/updProjectForUser',
      header: {
        token: app.gettoken(),
      },
      method: "post",
      data: {
        projectId: id
      },
      success: res => {
        if (res.data.code == 0) {
          wx.removeStorageSync('serchList')
            // wx.switchTab({
            //     url: '/pages/index/index',
            // })
            // wx.navigateTo({
            //     url: '/pages/firstPage/projectIndex/projectIndex?projectId='+id,
            // })
            wx.setStorageSync('dataid',id)
            wx.switchTab({
                url: '/pages/firstPage/projectIndex/projectIndex',
            })
            wx.showLoading({
              title: '加载中',
            })
        }
      }
    })
  },
  //查看更多
  seemore(){
    if(this.data.more==3){
      this.setData({
        more:100,
        moretext:'收起 '
      })
    }
    else{
      this.setData({
        more:3,
        moretext: '查看更多 >'
      })
    }
  }

})