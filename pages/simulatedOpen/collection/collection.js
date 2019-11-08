// pages/opening/collection/collection.js
const app = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
        // 1显示删除 其余的显示置顶
        status: 1,
        //true 收藏状态激活  false 收藏状态失效 
        active1: true,
        //true 选位大厅状态激活  false 收藏状态失效 
        active2: false,
        projectId: '',
        openActivity: {},
        //车位列表
        truckSpaces: [],
        //收藏人数
        collectNum: '',
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(e) {
        this.setData({
          projectId: e.projectId,
        });
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {},

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

      // 选位大厅跳转
      change2() {
        this.setData({
          active2: !this.data.active2,
          active1: !this.data.active1
        });

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
      enterHall() {
        // wx.navigateTo({
        //     url: '/pages/simulatedOpen/sellectionHall/sellectionHall',
        // })
        wx.navigateBack({
          delta: 1
        })
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
      renderData() {
        // clearInterval(timer);
        var that = this;
        // console.log(this.data.sellStatus);
        wx.request({
          method: 'post',
          url: app.url + '/product/auth0/truckSpace/openCollect',
          header: {
            token: app.gettoken(),
            "Content-Type": "application/json"
          },
          data: {
            projectId: that.data.projectId,
          },
          success: res => {
            // console.log(res.data.data);
            that.setData({
              truckSpaces: res.data.data.truckSpaces,
              openActivity: res.data.data.openActivity,
              collectNum: res.data.data.truckSpaces.length,
            })

          }

        })
      },
      //顶一下
      topPark(e) {
        // console.log('顶一下');
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var sellStatus = e.currentTarget.dataset.status;
        console.log(sellStatus);
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
      },
      //直接抢购
      rightBuy(e) {
        if (!this.data.setstatus) {
          wx.showToast({
            title: '项目还未开盘,请等待...',
            icon: 'none'
          })
          return
        }
        let carid = e.currentTarget.dataset.id
        wx.request({
          url: app.url + '/product/auth0/truckSpace/addSimulatedOpenRecord',
          method: 'post',
          header: {
            token: app.gettoken()
          },
          data: {
            truckSpaceId: carid
          },
          success: res => {
            if (res.data.code == 0) {
              wx.navigateTo({
                url: '/pages/my/order/order',
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
  setstatus() { //子组件倒计时结束调用修改状态  
    this.setData({
      setstatus: true
    })
  }  
  })