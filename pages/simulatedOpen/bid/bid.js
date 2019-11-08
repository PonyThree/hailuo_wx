// pages/opening/bid/bid.js
const app=getApp();
const md5 = require('../../../utils/md5.js')
var settime1
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userName: wx.getStorageSync('wx').nickName,
      Personal1: '0',
        fruit: [{
            id: 1,
            name: '钱包(￥)',
        }, {
            id: 2,
            name: '微信支付'
        }],
        //true 收藏状态激活  false 收藏状态失效 
        active1: true,
        //true 选位大厅状态激活  false 收藏状态失效  
        active2: false,
        cardid:'',
        current: '微信支付',
        position: 'right',
        time: app.newDate(),
        inputData: { // 输入框参数设置
          input_value: "", //输入框的初始内容
          value_length: 0, //输入框密码位数
          isNext: false, //是否有下一步的按钮
          get_focus: true, //输入框的聚焦状态
          focus_class: true, //输入框聚焦样式
          value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
          height: "98rpx", //输入框高度
          width: "604rpx", //输入框宽度
          see: false, //是否明文展示
          interval: true, //是否显示间隔格子
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
      console.log(e)
      if (e.carid) this.setData({
        carid: e.carid || '3653748341302362112'

      })
        this.setData({
          carid: e.carid,
           projectId: e.projectId
        })
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.getcarlist(this.data.carid) //获取车位详情
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      clearInterval(settime1)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      clearInterval(settime1)
    },
      
  //返回选位大厅
    goHall(){
     wx.navigateBack({
       detail:1
     })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    // 选择支付方式
    handleFruitChange({
        detail = {}
    }) {
        this.setData({
            current: detail.value
        });
        console.log(this.data.current);
    },
    // 认购支付成功
    godropsuccess() {
      if (!this.data.setstatus){
        wx.showToast({
          title: '项目还未开盘,请等待...',
          icon:'none'
        })
        return
      }
      wx.request({
        url: app.url + '/product/auth0/truckSpace/addSimulatedOpenRecord',
        method: 'post',
        header: {
          token: app.gettoken()
        },
        data:{
          truckSpaceId:this.data.carid
        },
        success: res => {
          if (res.data.code == 0) {
           wx.navigateTo({
             url: '/pages/my/order/order',
           })     
          }
          else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }
      })

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //获取车位相信信息
    getcarlist(carid) {
        //获取车位详情
        wx.request({
            url: app.url + '/product/auth0/open/truckSpaceDetail/' + carid,
            method: 'post',
            header: {
                token: app.gettoken()
            },
            success: res => {
                console.log(res.data.data);
                if (res.data.code == 0) {
                    this.setData({
                        data: res.data.data
                    })
          
                }
            }
        })
    },
 
  //查询项目可用余额
  getmoeny() {
    wx.request({
      url: app.url + '/user/auth0/userMoney/findAbleUseMoney',
      method: 'get',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId: this.data.data.projectId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            fruit: [{
              id: 1,
              name: '钱包(￥' + res.data.data + ')',
            }, {
              id: 2,
              name: '微信支付'
            }],
          })
        }
      }
    })
  },
  //添加收藏
  Collection() {
    if (this.data.data.collect) {  //用户收藏了就删除
      let truckSpaceIds = [this.data.data.id]
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
              icon: "clear"
            })
          }
          this.onShow()
        }
      })

    }
    else {
      let truckSpaceId = this.data.data.id
      wx.request({
        url: app.url + '/user/auth0/user/carCollect?truckSpaceId=' + truckSpaceId,
        method: 'post',
        header: {
          token: app.gettoken()
        },

        data: {
          truckSpaceId
        },
        success: res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '收藏成功',
            })
            this.onShow()
          }
        }
      })
    }
  },
  setstatus() { //子组件倒计时结束调用修改状态  
    this.setData({
      setstatus: true
    })
  }  

    
})