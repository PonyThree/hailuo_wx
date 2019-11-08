// pages/opening/collection/collection.js
const app = getApp();
var timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showRg:false,
    msg:'',
    projectId: '',
    // 1显示删除 其余的显示置顶
    status: 1,
    //true 收藏状态激活  false 收藏状态失效 
    active1: true,
    //true 选位大厅状态激活  false 收藏状态失效 
    active2: false,
    //车位列表
    truckSpaces: [],
    //项目名称
    projectName: '',
    //开盘时间
    openActivity: {},
    endTime: '',
    //开盘时间
    startTime: '',
    //开盘倒计时
    msg1: '',
    //收藏条数
    saveNum: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      projectId: e.projectId,
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
    this.renderData();
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

  //已购买跳转
  goPaysuccess() {
    clearInterval(timer);
    wx.navigateTo({
      url: '/pages/opening/Paysuccess/Paysuccess'
    })
  },
  addZero(n) {
    return n < 10 ? '0' + n : n;
  },
  // 时间戳转时间函数
  transformDate(time) {
    var t = new Date(time);
    var y = t.getFullYear();
    var mon = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    return y + '-' + this.addZero(mon) + '-' + this.addZero(d) + " " + this.addZero(h) + ":" + this.addZero(m) + ":" + this.addZero(s);
  },
  cutDownDate(time) {


    if (time == 0) {
      this.data.openStatus = 1;
      return;
    }
    var d = Math.floor(time / 1000 / 60 / 60 / 24);
    var hour = Math.floor(time / 1000 / 60 / 60 % 24);
    var min = Math.floor(time / 1000 / 60 % 60);
    var sec = Math.floor(time / 1000 % 60);
    return d + '天' + hour + "小时" + min + "分" + sec + "秒";
  },
  //顶一下
  topPark(e) {
    // console.log('顶一下');
    var id = e.currentTarget.dataset.id;
    var sellStatus = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    // console.log(id,sellStatus);
    //不是已出售的才可以顶一下
    if (sellStatus == 2 || sellStatus == 3) {
      wx.showToast({
        title: "该车位已售出，不允许被置顶",
        duration: 2000,
        icon: "none",
      })

    } else {
      if (index !== 0) {
        wx.request({
          method: 'post',
          url: app.url + '/user/auth0/user/top/' + id,
          header: {
            token: app.gettoken(),
            // "Content-Type": "application/json"
          },
          success: res => {
            // console.log(res.data)
            if (res.data.code == 0) {
              wx.showLoading({
                title: '置顶成功',
                duration: 2000
              });
              this.renderData();
            }
          }
        })
      } else {
        wx.showLoading({
          title: '第一个车位不允许顶一下',
          duration: 2000
        })
      }
    }
    // console.log(id);

  },
  //数据加载
  renderData() {
    clearInterval(timer);
    var that = this;
    wx.request({
      method: 'post',
      url: app.url + '/product/auth0/truckSpace/openCollect',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/json"
      },
      data: {
        projectId: this.data.projectId,
      },
      success: res => {
        console.log(res.data.data);
        var nowTime = app.newDate();
        let countDown = res.data.data.openActivity.startTime - nowTime;
        that.data.countDown = countDown;
        this.setData({
          //   车位列表数据加载
          truckSpaces: res.data.data.truckSpaces,
          saveNum: res.data.data.truckSpaces.length,
          // 头部数据加载
          projectName: res.data.data.openActivity.projectName,
          openActivity: res.data.data.openActivity,
          openStatus: res.data.data.openActivity.openStatus,
          endTime: this.transformDate(res.data.data.openActivity.endTime),
            msg1: this.cutDownDate(res.data.data.openActivity.startTime - nowTime)
        });
        timer = setInterval(() => {
            var msg1 = this.cutDownDate(that.data.countDown -= 1000)
          if (that.data.countDown < 1000) {
            clearInterval(timer)
            this.setData({
              openStatus: 1
            })
          }
          this.setData({
              msg1: msg1
          })
        }, 1000);


      }

    })
  },
  //筛选列表加载
  renderSXList() {
    //一级区域
    wx.request({
      url: app.url + '/product/auth0/truckSpaceArea/selectMiniAllList',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.projectId,
      },
      success: res => {
        //   console.log(res.data.data)
        if (res.data.code == 0) {
          this.setData({
            level1: res.data.data
          })
        }
      }
    })
    //二级区域
    wx.request({
      url: app.url + '/product/auth0/truckSpaceFloor/doSelectMiniAllList',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.projectId,
      },
      success: res => {
        //   console.log(res.data.data)
        if (res.data.code == 0) {
          this.setData({
            level2: res.data.data
          })
        }
      }
    })
    //三级区域
    wx.request({
      url: app.url + '/product/auth0/truckSpaceRidgepole/doMiniSelectAllList',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.projectId,
      },
      success: res => {
        //   console.log(res.data.data)
        if (res.data.code == 0) {
          this.setData({
            level3: res.data.data
          })
        }
      }
    })
  },
  //进入大厅
  enterHall() {
    wx.navigateTo({
      url: "/pages/opening/sellectionHall/sellectionHall",
    })
  },
  // 选位大厅跳转
  change2() {
    this.setData({
      active2: !this.data.active2,
      active1: !this.data.active1
    });
    clearInterval(timer);
    wx.navigateBack({
      delta: 1
    })
  },
  //取消收藏
  cancleSave(e) {
    var id = e.currentTarget.dataset.id;
    // console.log(id);
    var arr = [];
    arr.push(id);
    // console.log(arr);
    wx.request({
      method: 'post',
      url: app.url + '/user/auth0/user/carNotCollect',
      header: {
        token: app.gettoken(),
        "Content-Type": "application/json"
      },
      data: JSON.stringify(arr),
      success: res => {
        console.log(res.data);
        if (res.data.code == 0) {
          wx.showLoading({
            title: '取消收藏成功',
            duration: 2000
          });
          this.renderData();
        }
      }
    })
  },
  //直接抢购
  rightBuy(e) {
    let sub = e.currentTarget.dataset.sub
    // if (sub==false){
    //   wx.showToast({
    //     title: '抱歉,您暂时不能认购',
    //     icon: 'none'
    //   })
    //   return
    // }
 
    var that=this;
    this.setData({
      buttonClicked: true
    })
    setTimeout(_ => {
      this.setData({
        buttonClicked: false
      })
    }, 1000)

    let carid = e.currentTarget.dataset.id
    console.log(carid)
    wx.request({
      url: app.url + '/product/auth0/subPayTruckSpace',
      method: "post",
      header: {
        token: app.gettoken()
      },
      data: {
        "truckSpaceId": carid,
        type: 2
      },
      success: res => {
        if (res.data.code == 0) {
          let req = res.data.data
          //调取原生支付接口
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: 'prepay_id=' + res.data.data.prepayId,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success: function(res) {
              console.log(res, "成功")
              wx.showLoading({
                title: '正在处理',
              })
              var paytime = setInterval(() => { //一直获取订单回调 直到后台订单响应
                wx.request({
                  url: app.url + '/order/auth0/orderForm/' + req.orderNo,
                  method: 'get',
                  header: {
                    token: app.gettoken()
                  },
                  success: res => {
                    if (res.data.code == 0) {
                      wx.hideLoading()
                      clearInterval(paytime)
                      wx.navigateTo({
                        url: '/pages/my/order/order'
                      })
                    } else if (res.data.code != 15) {
                        wx.hideLoading();
                        that.setData({
                            showRg: true,
                            msg: res.data.msg
                        })
                        clearInterval(paytime)
                    }


                  }
                })
              }, 1000)
            },
            fail: function(res) {
              console.log(res, "失败")
            },
            complete: function(res) {
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },


})