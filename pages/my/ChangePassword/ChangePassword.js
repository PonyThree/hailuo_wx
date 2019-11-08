const md5 = require('../../../utils/md5.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    codename:"获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '修改支付密码',
    });
    this.setData({
      name: wx.getStorageSync('user').name,
      phone: wx.getStorageSync('user').mobile,
      userimg: wx.getStorageSync('user').headImg,
    })

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
  getNameValue: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue: function(e) {
    this.setData({
      phone: parseInt(e.detail.value)
    })
  },
  getCodeValue: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  
  pass: function(e) {
    this.setData({
      pass: e.detail.value
    })
  },
  pass1: function (e) {
    this.setData({
      pass1: e.detail.value
    })
  },
  //修改密码
  updatapass(){
    if(this.data.pass!=this.data.pass1){
      wx.showToast({
        title: '两次输入的密码不一致',
        icon:'none'
      })
    }
    wx.request({
      url: app.url + '/user/auth0/user/updatePassword',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        newPassword: this.data.pass,
        code:this.data.code,
        mobile: this.data.phone
      },
      success: res => {
        if (res.data.code == 0) {
          wx.navigateBack({
            delta:1
          })
          wx.showToast({
            title: '修改成功',
          })
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //获取手机验证码方法
  getCode: function() {
      var a = this.data.phone;
      var _this = this;
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (this.data.phone == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else if (!myreg.test(this.data.phone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else {
        _this.setData({
          disabled: true
        })
        var time = new Date().getTime()
        var data = "zycdcsheatbeancarskey" + this.data.phone + "1" + time + "zycdcsheatbeancarskey"
        wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "get",
          url: app.url + "/user/auth0/user/sendVerifyCode?mobile=" + this.data.phone,
          header: {
            token: app.gettoken()
          },
          success(res) {
            console.log(res)
            var num = 61;
            var timer = setInterval(function() {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                _this.setData({
                  codename: '重新发送',
                  disabled: false
                })
              } else {
                _this.setData({
                  codename: num + "s后重试"
                })
              }
            }, 1000)
          },
        })
      }
    }


    ,
})