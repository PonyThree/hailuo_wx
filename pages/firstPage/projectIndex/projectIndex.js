// pages/firstPage/index/index.js
const app = getApp()
const scancode = require('../../../utils/scanCode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId: '',
    showCode: false,
    guideStatus: 1,
    //banner
    imgUrls: [],
    //项目名称
    projectName: '',
    //现场开盘状态值
    localOpen: '',
    // 模拟开盘状态值
    rehearseOpen: '',
    titlename: '',
    dataid: '',
    showAvgPrice: false,
    swiperCurrent: 0,
    activityBanner: [] //活动banner
  },
  /**
   * 跳转到加油省钱页面
   */
  addOilSaveMoney: function() {
    wx.navigateTo({
      url: "/pages/firstPage/addOilSaveMoney/addOilSaveMoney?privateId=" + this.data.projectId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    if (e.projectId) { //如果通过扫描小程序码进入
      wx.setStorageSync('dataid', e.projectId)
    }
 


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
    this.setData({
      projectId: wx.getStorageSync('dataid'),

    })
    this.getdata()

  
    

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onShow(),
      wx.showNavigationBarLoading(),
      setTimeout(() => {
        app.stopre()
      }, 1000)
      this.getdata()  //下拉刷新更新数据
  },
  goActivity() {
    if (!this.getCodeStatus()) return
    wx.navigateTo({
      url: '/pages/activity/seckill/limitedBuying/limitedBuying?projectId=' + this.data.projectId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // this.data.projectId
    let url = `/pages/firstPage/projectIndex/projectIndex?projectId=${this.data.projectId}`

    return {
      title: "找车位，上「海螺」",
      path: url
    }
  },
  //跳转到切换项目
  goSwitchingitems() {
    wx.navigateTo({
      url: '/pages/project/Switchingitems/Switchingitems',
    })
  },

  // 跳转到搜索
  gosearh() {
    wx.navigateTo({
      url: "/pages/project/search/search",
    })
  },

  //跳转到开盘项目简介
  gosellectionHall(e) {
    if (!this.getCodeStatus()) return
    var no = e.currentTarget.dataset.no;
    //为0跳转到真实开盘
    if (no == 0) {
      wx.navigateTo({
        url: '/pages/opening/signAgreement/signAgreement?projectId=' + this.data.projectId,
      })
    } else {
      //否则模拟开盘
      wx.navigateTo({
        url: '/pages/simulatedOpen/signAgreement/signAgreement?projectId=' + this.data.projectId,
      })
    }
  },
  // 活动banner跳转
  goPage(e) {
    if (!this.getCodeStatus()) return
    var href = e.currentTarget.dataset.href;
    var type = e.currentTarget.dataset.type || "";
    //1活动 2项目首页 3.外部 0不跳转
    if (type == 1) {
      wx.navigateTo({
        url: `/pages/activity/seckill/limitedBuying/limitedBuying?projectId=${this.data.projectId}`,
      })
    }
    if (type == 2) {
      wx.switchTab({
        url: '/pages/firstPage/projectIndex/projectIndex',
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/project/webview/webview?url=' + href,
      })
    }
    if (type == 0) {

    }

  },

  readMore() { //查看更多车位列表
    wx.navigateTo({
      url: '/pages/project/Parkinglist2/Parkinglist2?projectId=' + this.data.projectId,
    })
  },
  gosalelogs() {
    wx.navigateTo({
      url: '/pages/firstPage/Salelogs/Salelogs?projectId=' + this.data.projectId,
    })
  },
  //加载数据
  getdata() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
        method: "POST",
        url: app.url + "/project/auth0/project/getHomePageData",
        header: {
          token: app.gettoken(),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          'projectId': this.data.projectId,
        },
        success: res => {
          wx.hideLoading()
          if (res.data.data != null) {
            let pepoleList = {
              sellingNum: res.data.data.sellingNum,
              total: res.data.data.total
            }
            that.setData({
              pepoleList,
              imgUrls: res.data.data.bannerVoList,
              districtVo: res.data.data.districtVo,
              guideStatus: res.data.data.guideStatus,
              activityInfoVo: res.data.data.activityInfoVo,
              localOpen: res.data.data.localOpen || false,
              rehearseOpen: res.data.data.rehearseOpen || false,
              projectHomeResp: res.data.data.projectHomeResp
            })
            that.setData({
              titlename: res.data.data.projectHomeResp.name || '',
            })
            wx.setNavigationBarTitle({
              title: res.data.data.projectHomeResp.name, //设置标题名字
            })
            wx.hideLoading()
          }
        }
      }),
      wx.request({
        url: app.url + '/user/userProject/auth0/isAddProject/' + this.data.projectId,
        header: {
          token: app.gettoken()
        },
        success: res => {

          //已绑定
          if (res.data.code == 0) {
            this.setData({
              showAvgPrice: true
            })
          } else {
            this.setData({
              showAvgPrice: false
            })
          }


        }
      })
    // 获取项目基本信息
    wx.request({
      url: app.url + '/project/auth0/miniProject/miniProjectInfo?projectId=' + this.data.projectId,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {

          var date = res.data.data.startTime
          date = date.substring(0, 19);
          date = date.replace(/-/g, '/');
          res.data.data.startTime = new Date(date).getTime(); //把字符串时间转为时间戳
          this.setData({
            ProjectInfo: res.data.data
          })
        }
      }
    })

    // 获取置业顾问信息
    wx.request({
      url: app.url + '/consultant/auth0/consultant/findByProject',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.projectId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            consultantlist: res.data.data
          })
        }
      }
    })
    //获取项目公告信息
    wx.request({
      method: 'post',
      header: {
        token: app.gettoken(),
        "content-type": 'application/x-www-form-urlencoded'
      },
      data: {
        projectId: this.data.projectId
      },
      url: app.url + '/project/auth0/notice/miniFindList',
      success: res => {
        if (res.data.code != 0) return
        this.setData({
          miniFindList: res.data.data
        })
      }
    })
    // 获取活动banner
    wx.request({
      method: "GET",
      url: app.url + '/project/auth0/banner/getCenterBannerList',
      header: {
        token: app.gettoken(),
        "content-type": 'application/json'
      },
      data: {
        projectId: this.data.projectId

      },
      success: res => {
        console.log("活动banner", res.data.data);
        let result = res.data.data;
        let activityBanner = [];
        if (result && result.length > 0) {
          result.forEach(item => {
            activityBanner.push({
              href: item.href,
              type: item.type,
              imgUrl: item.imgUrl
            })
          })
        } else {
          activityBanner.push({
            imgUrl: "https://china185.com/file/image/20191028/67d1ba26d2144dab889a2d3c97e5cf20.gif",
            type: "",
            href: ""
          })
        }

        this.setData({
          activityBanner
        })
      }
    })
    // 获取项目证书
    wx.request({
        method: 'post',
        url: app.url + '/project/auth0/projectCert/pageList',
        header: {
          token: app.gettoken(),
          "content-type": 'application/json'
        },
        data: {
          projectId: this.data.projectId
        },
        success: res => {
          if (res.data.code != 0) return
          if (res.data.data.records) {
            this.setData({
              cerList: res.data.data.records
            })
          }

        }
      }


    )
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
    this.getloudong()
    //获取首页消息
    app.http('post', '/user/auth0/indexMessage/getMessages', {
      projectId: this.data.projectId
    }).then(res => {
      this.setData({
        Messages: res.data.data || []
      })
    })
  },




  //跳转到H5软文页面
  web(e) {
    if (!this.getCodeStatus()) return

    let url = e.currentTarget.dataset.url;
    let type = e.currentTarget.dataset.type;
    // type=1内部跳转  0外部跳转
    if (type == 1) {
      wx.navigateTo({
        url: url,
      })
    }
    // 外部跳转
    if (type == 0) {
      wx.navigateTo({
        url: '/pages/project/webview/webview?url=' + url,
      })
    }
    if (type == 2) {
      wx.navigateToMiniProgram({
        appId: url,
        path: 'pages/index/index',
        envVersion: 'release',
        success(res) {

        }
      })
    }
  },
  //搜索
  search(e) {
    let name = e.detail.value
    // this.data.projectId
    wx.navigateTo({
      url: '/pages/project/searchlist/searchlist?name=' + name + '&projectId=' + this.data.projectId,

    })
  },
  goCarList() {
    if (!this.getCodeStatus()) return
    if (wx.getStorageSync('searchcriteria')) {
      wx.navigateTo({
        url: '/pages/project/Parkinglist2/Parkinglist2?projectId=' + this.data.projectId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/project/selection/selection?projectId=' + this.data.projectId,
      })
    }


  },
  //项目公告查看更多
  bulletinReadMore() {
    wx.navigateTo({
      url: '/pages/project/bulletin/bulletin?projectId=' + this.data.projectId,
    })
  },
  // 扫码查看均价
  seeAvgPrice() {
    wx.scanCode({
      success: res => {
        wx.request({
          url: app.url + '/user/userProject/auth0/addProjectForUser',
          header: {
            token: app.gettoken(),
          },
          method: "post",
          data: {
            projectId: this.data.projectId
          },
          success: res => {
            if (res.data.code == 0) {
              this.setData({
                showAvgPrice: true
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              this.setData({
                showAvgPrice: false
              })
            }
          }
        })
      }
    })
  },
  //项目公告查看更多
  bulletinReadMore() {
    wx.navigateTo({
      url: '/pages/project/bulletin/bulletin?projectId=' + this.data.projectId,
    })
  },
  getloudong(e) { //根据项目ID获取用户是否需要选择区层栋
    wx.request({
      method: "POST",
      url: app.url + '/user/auth0/userProjectSelected/getByParams',
      header: {
        token: app.gettoken(),
        "content-type": 'application/json'
      },
      data: {
        projectId: this.data.projectId

      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data == null) {
            wx.removeStorageSync('searchcriteria')
          } else {
            let data = res.data.data
            delete data.id
            data.level1 = [res.data.data.level1]
            data.level2 = res.data.data.level2
            data.level3 = [res.data.data.level3]
            wx.setStorageSync('searchcriteria', res.data.data)
          }
        }
      }
    })

  },
  //扫码
  scanCode(e) {
    wx.navigateTo({
      url: '/pages/project/Switchingitems/Switchingitems?from=projectList',
    })
    this.onClose()
  },
  onClose() {
    this.setData({
      showCode: false
    })
  },
  cancle() {
    this.onClose()
  },
  //   确定
  confirm() {
    this.scanCode()
  },
  // 给职业顾问打电话
  callGw() {
    console.log(this.data.consultantlist.length)
    if (this.data.consultantlist.length > 0) {
      wx.makePhoneCall({
        phoneNumber: this.data.consultantlist[0].phone,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.showToast({
        title: '暂时没有联系电话',
        icon: 'none'
      })
      return;
    }

  },
  previewImage(e) { //项目证书图片预览
    let imglist = []
    for (let i in this.data.cerList) {
      imglist.push(this.data.cerList[i].certImage)
    }
    let img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img,
      urls: imglist

    })

  },
  getCodeStatus() { //判断有没有扫描二维码绑定项目
    if (!this.data.showAvgPrice) {
      this.setData({
        showCode: true
      })
      return false
    } else return true
  },
  swiperChange(e) {  //轮播图小点
    let current = e.detail.current;
    let that = this;
    that.setData({
      swiperCurrent: current,
    })
  }
})