// // pages/firstPage/addOilSaveMoney/addOilSaveMoney.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1:true,
    code: "", //兑换码
    mobile: null, //用户电话号码
    status: 3, //是否输入过兑换码
    carportBool: false, //是否展示选择车位信息
    seckillBool: false, //是否有秒杀活动
    carportData: [], //被选购车位数据
    miniFavorablePrice: 0, // 优惠额度
    miniPrice: 0, //秒杀价格
    projectId: null, //项目id
    msgInfo: null, //秒杀信息
    itemTel: null, //项目方电话号码
    sceneBool: false, //场景值！ true为小程序码进入  false为其他方式
    // url: "https://eatbeancar.goho.co"
    url: 'https://www.chidouche.com/api'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    // console.log("option", options);
    let privateId = wx.getStorageSync('dataid')

    this.setData({
      projectId: privateId
    })
    // 获取项目电话
    this.gainItemTel();
    // 判断是否有秒杀活动
    this.gainActivityBool(privateId)
    // 判断是否输入过电话号码
    this.judegMobile();
    // 判断是从什么环境进入
    this.gainScene();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 获取进入本页面的环境
   */
  gainScene: function () {
    let result = wx.getLaunchOptionsSync()
    if (result.scene === 1047 ) {
      this.setData({
        sceneBool: true
      })
    }

  },
  /**
   * 获取是否拥有秒杀活动
   */
  gainActivityBool: function (projectId) {
    wx.request({
      url: app.url + '/activity/auth0/activityTab/getTabType',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId
      },
      success: (res) => {
        let result = res.data.data;
        if (result.length > 0) {
          let bool = result.includes(1);
          if (bool) {
            this.gainSeckillMessage(this.data.projectId);
          } else {
            this.gainCarportMessage(this.data.projectId);
          }
        } else {
          this.gainCarportMessage(this.data.projectId);
        }
      }
    })
  },
  /**
   * 获取项目方电话号码
   */
  gainItemTel: function () {
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
          if (res.data.data.length > 0) {
            this.setData({
              itemTel: res.data.data[0].phone
            })
          }
        }
      }
    })
  },
  /**
   * 验证手机号是否正确
   */
  verifyMobile: function (mobile) {

    wx.request({
      url: this.data.url + '/eatbeancar-life-points/refuelRecord/checkCode',
      method: "post",
      data: {
        source: 1,
        mobile
      },
      success: (res) => {
        wx.hideLoading()
    
        if (res.data.code == 0) {

          let type = res.data.data.type
          let mobile = res.data.data.mobile
          if (type == 0) {
            this.setData({
              status: 0,
              mobile
            })

          } else if (type == 1) {
            this.setData({
              status: 1,
              mobile
            })

          }

        }

      }
    })
  },
  /**
   * 关闭秒杀
   */
  seckillClear: function () {
    this.setData({
      seckillBool: false
    })
  },
  /**
   * 关闭选车位
   */
  carportClear: function () {
    this.setData({
      carportBool: false,
      seckillBool:false
    })
  },
  /**
   * 获取电话号码判断是否输入过code
   */
  // async
  judegMobile: function () {
    let tel = wx.getStorageSync('user').mobile
    this.verifyMobile(tel)

  },
  /**
   * 获取输入的电话号码
   * @param {object} e  
   */
  telChange: function (e) {
    let value = e.detail.value;
    // console.log("!!!!!", value);
    this.setData({
      code: value
    })
  },



  /**
   * 立即加油 
   */
  instantlyAddOil: function () {

    if (!this.data.code) {
      wx.showToast({
        title: '请输入兑换码!',
        icon: 'none'
      })
      return ;
    }
    console.log('验证加油码开始')
    app.http('post', '/activity/auth0/dataTurn/get/',{num:this.data.code}).then(res=>{
      if(res.data.code==0 && res.data.data){  //通过批次号换兑换码
        this.setData({
          dataTurn:res.data.data
        })
        wx.request({
          url: this.data.url + '/eatbeancar-life-points/refuelRecord/checkCode_0',
          method: "POST",
          data: {
            code: res.data.data.code,
            mobile: this.data.mobile,
            source: 1
          },
          success: (res) => {
            let result = res.data;
            if (result.code === 1) {
              wx.showToast({
                title: result.msg,
                icon: 'none'
              })
              this.setData({
                status: 0
              })
            } else if (result.code == 0) {

            wx.showToast({
              title: '恭喜您获得加油会员资格',
            })
              let data = this.data.dataTurn
              app.http('post', '/activity/auth0/dataTurn/changeStatus',data)  //更改批次号状态
              this.setData({
                status: 1,
              })

            }
          }
        })

      }
      else if (res.data.code==0 && res.data.data==null){  //直接通过兑换码
        wx.request({
          url: this.data.url + '/eatbeancar-life-points/refuelRecord/checkCode_0',
          method: "POST",
          data: {
            code: this.data.code,
            mobile: this.data.mobile,
            source: 1
          },
          success: (res) => {
            let result = res.data;
            if (result.code === 1) {
              wx.showToast({
                title: result.msg,
                icon: 'none'
              })
              this.setData({
                status: 0
              })
            } else if (result.code == 0) {

              wx.showToast({
                title: '恭喜您获得加油会员资格',
              })
           
              this.setData({
                status: 1,
              })

            }
          }
        })
      }
      else{
        wx.showToast({
          title: '请输入正确的兑换码',
          icon:'none'
        })
      }
    })
  
  },
  /**
   *拨打电话 
   */
  phoneNumber: function () {
    if (!this.data.itemTel) {
      wx.showToast({
        title: '暂时没有联系电话',
        icon: 'none'
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.itemTel,
    })
  },
  /**
   * 跳转到选择车位页
   */
  goCarport: function () {
    wx.navigateTo({
      url: '/pages/project/selection/selection?projectId=' + this.data.projectId
    })
  },
  /** 
   * 跳转到秒杀活动页
   */
  goSeckill: function () {
    wx.navigateTo({
      url: '/pages/activity/seckill/limitedBuying/limitedBuying?projectId=' + this.data.projectId
    })
  },
  /**
   * 获取车位实时信息
   */
  gainCarportMessage: function (projectId) {
    // 192.168.1.32:7999/user/auth0/indexMessage/getWxMsgs?privateId=3702773472015941632
    wx.request({
      url: app.url + '/user/auth0/indexMessage/getWxMsgs',
      header: {
        token: app.gettoken()
      },
      method: "get",
      data: {
        projectId
      },
      success: (res) => {

      if(res.data.code==0){
        this.setData({
          carportData:res.data.data,
          seckillBool: false,
          carportBool: true
        })

      }
   
       
      }
    })
  },

  //   /**
  //    * 获取秒杀信息
  //    */
  gainSeckillMessage: function (projectId) {

    wx.request({
      url: app.url + '/product/auth0/activityTruckSpace/getWxTruckInfo',
      method: "get",
      header: {
        token: app.gettoken()
      },
      data: {
        projectId
      },
      success: (res) => {
        let {
          miniFavorablePrice,
          miniPrice,
          msgInfo
        } = res.data.data;

        this.setData({
          miniFavorablePrice,
          miniPrice,
          msgInfo,
          seckillBool: true,
          carportBool: false
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})