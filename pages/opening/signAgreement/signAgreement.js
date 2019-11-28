// pages/opening/signAgreement/signAgreement.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDot: false,
    agreeMent:'',
    projectId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      this.setData({
        projectId: options.projectId,
      });
      this.getAgreeMent();
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
    //根据项目ID获取用户是否需要选择区层栋
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
  handleDot() {
    this.setData({
      showDot: !this.data.showDot
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
  // 跳转到销售大厅 
  gosellectionHall() {
      if(this.data.showDot==true){
        if (wx.getStorageSync('searchcriteria')){
          wx.redirectTo({
            url: '/pages/opening/sellectionHall/sellectionHall?projectId=' + this.data.projectId,
          })
        }
        else{
          wx.redirectTo({
            url: '/pages/project/selection/selection?projectId=' + this.data.projectId,
          })
        }
      }
      else{
        wx.showToast({
          title: '请勾选同意用户协议',
          icon:'none'
        })
      }
  },
//   协议数据加载 3655925066186620928
 getAgreeMent(){
     var that=this;
     wx.request({
         method:'post',
         url: app.url +'/project/auth0/miniProject/projectAgreement/',
         header: {
             token: app.gettoken(),
             "Content-Type": "application/x-www-form-urlencoded"
         },
       data: {
         'projectId': this.data.projectId,
         type: 2
       },
         success:res=>{
             that.setData({
                 agreeMent: res.data.data
             })
         }
     })
 }
})