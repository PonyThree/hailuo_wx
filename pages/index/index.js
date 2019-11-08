// pages/index/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据jiaz
   */
  data: {
    down: false,
    firstEntry: wx.getStorageSync('firstEntry'),
    titlename: '定位中...'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "海螺找位"
    })
    var that = this;
    console.log(options)
    if (options.q) { //判断是否为扫码项目二维码进入
      console.log(options.q)
      var scanid = options.q.substring(options.q.lastIndexOf('D') + 1)
      wx.setStorageSync('scanid', scanid)
    }
 
    if (wx.getStorageSync('scanid')) { //判断是否通过二维码进入
      let projectId = wx.getStorageSync('scanid')
      wx.request({
        url: app.url + '/user/userProject/auth0/addProjectForUser',
        header: {
          token: app.gettoken(),
        },
        method: "post",
        data: {
          projectId: projectId
        },
        success: res => {
          if (res.data.code == 0) {
           
            wx.switchTab({
                url: '/pages/firstPage/projectIndex/projectIndex',
            })
            wx.setStorageSync('dataid', projectId)  
            this.choice(projectId) //扫码成功直接切换项目
          }
           else if(res.data.code==1) {
            wx.removeStorageSync('scanid')
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
          
        }
      })
    }
    if (options.shareUrl) { //判断用户是否分享进入
      wx.navigateTo({
        url: '/pages/project/webview/webview?url=' + options.shareUrl,
      })
    }
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    setTimeout(function() {
     
      app.stopre()
    }, 1000)
    //获取首页banner
    wx.request({
      url: app.url + '/platform/auth0/banner/miniBannerList',
      header: {
        token: app.gettoken()
      },
      success: res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.setData({
            bannerlist: res.data.data
          })
        }
      }
    })
    //获取第三方连接
    wx.request({
      url: app.url + '/platform/auth0/thirdLinks/findList',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            findlist: res.data.data
          })
        }
      }
    })
    //获取首页咨询
    wx.request({
      url: app.url + '/platform/auth0/information/findLists',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            findlists: res.data.data
          })
        }
      }
    })
    //合作项目列表
    wx.request({
      url: app.url + '/project/auth0/project/miniFrontShowProjects',
      header: {
        token: app.gettoken()
      },
      success: res => {

        if (res.data.code == 0) {
          this.setData({
            miniFrontShowProjects: res.data.data || []
          })
        }
      }
    })
    //获取首页消息
    wx.request({
      method:'post',
      url: app.url + '/user/auth0/indexMessage/getMessages',
      header: {
        token: app.gettoken(),
          "content-type":'application/x-www-form-urlencoded'
      },
      success: res => {

        if (res.data.code == 0) {
          this.setData({
            Messages: res.data.data || []
          })
        }
      }
    })
    this.getLocation() //通过当前位置查询附近的项目
     this.getNotRede() //获取未读消息条数
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    this.onShow()
    wx.showNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function() {
    return {
      title: "找车位，上「海螺」"
    }
  },
  //下拉列表

  // 跳转到全部楼盘
  goAllflats() {
    wx.navigateTo({
      url: "/pages/project/Allflats/Allflats",
    })
  },
  // 跳转到车位导购
  goCollection(e) {
    if (e.currentTarget.dataset.first) {
      wx.setStorageSync('firstEntry', true)
    }
    this.sweepcode() //判断是否需要扫码进入

    wx.navigateTo({
      url: '/pages/project/Collection/Collection',
    })
  },

  goStrategy() {
    wx.navigateTo({
      url: '/pages/project/Strategy/Strategy',
    })
  },
  //跳转到切换项目
  goSwitchingitems() {
    wx.navigateTo({
      url: '/pages/project/Switchingitems/Switchingitems',
    })
  },
  // 跳转到个人收藏
  gocollection() {
    wx.navigateTo({
      url: '/pages/my/collection/collection',
    })
  },
  // 跳转到搜索
  gosearh() {
    wx.navigateTo({
      url: "/pages/project/search/search",
    })
  },
  //去项目首页
  project(e) {
    if (e.currentTarget.dataset.localStatus == 1) { //是否需要扫码
      wx.showModal({
        title: '该项目只限本小区户主购买',
        content: '请回首页扫码添加项目',
        showCancel: false
      })
      return
    }
    let id = e.currentTarget.dataset.id
      wx.setStorageSync('dataid', id)
    // wx.navigateTo({
    //   url: '/pages/firstPage/projectIndex/projectIndex?projectId=' + id
    // })
    wx.switchTab(
        {
            url:'/pages/firstPage/projectIndex/projectIndex'
        }
    )
  },
  //跳转到H5软文页面
  web(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let url = e.currentTarget.dataset.url
    if (type == 0 || type == null) {
      wx.navigateTo({
        url: '/pages/project/webview/webview?url=' + url,
      })
    } else if (type == 1) {
      wx.navigateTo({
        url: url,
      })
    }

  },
  // 根据精度获取位置
  getLocation: function() {
    wx.showLoading({
      title: '查找附近小区中',
    })
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // console.log(latitude, longitude)
        // _this.setData({
        //     judgeLocation:true,
        // })
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
                positionList: res.data.data,
                judgeLocation:false
              })
              wx.request({ //判断用户是否有项目,没有项目绑定附近的第一个
                url: app.url + '/user/userProject/auth0/selProjectIdByUser',
                header: {
                  token: app.gettoken()
                },
                success: res => {
                 
                  if (res.data.code == 0) {
                    _this.setData({
                      titlename: res.data.data.name,
                      dataid: res.data.data.id,
                      localStatus: false,
                      
                    })
                    wx.setStorageSync('dataid', res.data.data.id)
                    wx.setStorageSync('localStatus', false)
                  } else if (res.data.code == 1) {
                    console.log('用户还没绑定项目')
                    _this.setData({
                      titlename: _this.data.positionList[0].name,
                      dataid: _this.data.positionList[0].id,
                      localStatus: _this.data.positionList[0].localStatus,
                    })
                    wx.setStorageSync('dataid', _this.data.positionList[0].id)
                    wx.setStorageSync('localStatus', _this.data.positionList[0].localStatus, )
                  }
                }
              })

            }
          }
        })
      },
      fail(res) {
        wx.showToast({
            title: '请打开定位,以便我们找到你所在小区',
            icon:'none'
        })
        _this.setData({
            judgeLocation: true,
        })
      }
    })
    // console.log(_this.judgeLocation)
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
              text: res.data.data.toString(),
            })
          } else {
            wx.removeTabBarBadge({
              index: 2,
            })
          }
        }
        if (res.statusCode == 401) {
          wx.redirectTo({
            url: '/pages/project/wx_logoin/wx_logoin',
          })
        }
        if (res.data.code == 401) {
          wx.redirectTo({
            url: '/pages/project/wx_logoin/wx_logoin',
          })
        }
      }
    })

  },
  //提示未绑定用户去扫码
  sweepcode(e) {
   
    if (this.data.localStatus) {
      wx.showModal({
        title: '该项目只限本小区户主购买',
        content: '请回首页扫码添加项目',
        showCancel: false
      })
      return
    }


  },

  choice(projectId) { //扫码成功后切换项目
    let id = projectId || e.currentTarget.dataset.id
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
          wx.removeStorageSync('scanid')
        }
      }
    })
  },
//   banner跳转 
  jump(e) {
    // console.log(e);
    var href = e.currentTarget.dataset.href;
    var type = e.currentTarget.dataset.type || "";
    //1内部跳转 2项目首页 3活动
    if (type == 1) {
      wx.navigateTo({
        url: `${href}`,
      })
    }
    if (type == 2) {
        wx.switchTab({
            url: '/pages/firstPage/projectIndex/projectIndex',
        })
    //   wx.navigateTo({
    //     url: "/pages/firstPage/projectIndex/projectIndex?projectId=" + wx.getStorageSync('dataid'),
    //   })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/project/webview/webview?url=' + href,
      })
    }
    if (type == 0) {
      console.log('不跳转')
    }
  },

 
})