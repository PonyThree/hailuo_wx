// pages/firstPage/loans/loans.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usernameValue: "",
    telValue: "",
    moneyValue: "",
    // 车辆情况
    carPickerBool: true, //车辆情况显示boolean值
    carSelectData: "", //车辆情况数据
    carPickerData: [
      ["单辆车", "暂无车", "多辆车"]
    ],
    carPickerTitle: "车辆情况",
    // 意向区域
    locationPickerBool: true, //意向区域显示boolean值
    locationSelectData: "", //意向区域情况数据
    locationPickerData: [],
    locationPickerTitle: "意向区域",
    // 申请期限
    deadlinePickerBool: true, //申请期限显示boolean值
    deadlineSelectData: "", //申请期限情况数据
    deadlinePickerData: [
      ["5年", "10年", "20年", "30年"]
    ],
    deadlinePickerTitle: "申请期限",

    // placeholderNameValue: "请填写您的姓名", //placeholder值
    // placeholderNameValue: "请填写您的手机号",
    // placeholderNameValue: "请填写您的姓名",
    // 银行logo图片
    bankImg: [
      "https://china185.com/file/image/20191029/2fab721e881d4b4b836bd43a06bb36e2.png",
      "https://china185.com/file/image/20191029/4f1d960a478f45b986fd8fb28172ea15.png",
      "https://china185.com/file/image/20191029/b82bd3bf437a441991b1f0ab472aea20.png"
    ]
  },

  // 获取组件信息
  gainComponentMsg: function (e) {
    let {
      ComponentBool,
      selectData,
      type
    } = e.detail;

    switch (type) {
      case "car":
        if (ComponentBool && !selectData) {
          this.selectComponent(".car").hiddenAnimation(this, {
            carPickerBool: true,
          })
        } else {
          this.selectComponent(".car").hiddenAnimation(this, {
            carPickerBool: true,
            carSelectData: this.manageSelect(selectData)
          })
        }
        break;
      case "location":
        if (ComponentBool && !selectData) {
          // 隐藏动画
          this.selectComponent(".location").hiddenAnimation(this, {
            locationPickerBool: true,
          })
        } else {
          this.selectComponent(".location").hiddenAnimation(this, {
            locationPickerBool: true,
            locationSelectData: this.manageSelect(selectData)
          })
        }
        break;
      case "deadline":
        if (ComponentBool && !selectData) {
          this.selectComponent(".deadline").hiddenAnimation(this, {
            deadlinePickerBool: true,
          })
        } else {
          this.selectComponent(".deadline").hiddenAnimation(this, {
            deadlinePickerBool: true,
            deadlineSelectData: this.manageSelect(selectData)
          })
        }
        break;
      default:
        break;
    }
  },
  /** 
   * 处理组件返回的数组转换成字符串
   */
  manageSelect: function (arr) {
    let str = ""
    arr.forEach(item => {
      str += item;
    })
    return str
  },
  /**
   * 用户姓名 贷款金额 手机号码数据绑定
   */
  changeValue: function (e) {
    let value = e.detail.value;
    let tag = e.target.dataset.tag;
    switch (tag) {
      case "username":
        this.setData({
          usernameValue: value
        })
        break;
      case "tel":
        this.setData({
          telValue: value
        })
        break;
      case "money":
        this.setData({
          moneyValue: value
        })
        break;
      default:
        break;
    }
  },
  /**
   * 展示组件
   * */
  showPicker: function (e) {
    // console.log(e.target.dataset.tag);
    let tag = e.target.dataset.tag;
    switch (tag) {
      case "car":
        this.setData({
          carPickerBool: false
        })
        this.selectComponent(".car").showAnimation()
        break;
      case "location":
        this.setData({
          locationPickerBool: false
        })
        this.selectComponent(".location").showAnimation()
        break;
      case "deadline":
        this.setData({
          deadlinePickerBool: false
        })
        this.selectComponent(".deadline").showAnimation()
        break;
      default:
        break;
    }
  },
  // 跳转到银行详情
  goBankDetail: function () {
    wx.navigateTo({
      url: '/pages/firstPage/loans/bank/bank'
    })
  },
  /**
   * 提交资料
   */
  submitMessage: function () {
    let {
      usernameValue,
      telValue,
      moneyValue,
      carSelectData,
      locationSelectData,
      deadlineSelectData
    } = this.data;
    let params = {}

    if (!usernameValue) {
      wx.showToast({
        title: '请填写您的姓名！',
        icon: 'none'
      })
      return;
    }
    if (!moneyValue) {
      wx.showToast({
        title: '请填写贷款金额！',
        icon: 'none'
      })
      return;
    } else if (moneyValue < 50000 || moneyValue > 200000) {
      wx.showToast({
        title: '您输入的贷款金额不符合规定区间！',
        icon: 'none'
      })
      return;
    }

    if (!telValue) {
      wx.showToast({
        title: '请填写您的手机号！',
        icon: 'none'
      })
      return;
    } else if (!(/^1[3456789]\d{9}$/.test(telValue))) {
      wx.showToast({
        title: '请填写正确的手机号！',
        icon: 'none'
      })
      return false;
    }
    if (!carSelectData) {
      wx.showToast({
        title: '请选择车辆情况！',
        icon: 'none'
      })
      return;
    }
    if (!locationSelectData) {
      wx.showToast({
        title: '请选择意向区域！',
        icon: 'none'
      })
      return;
    }
    if (!deadlineSelectData) {
      wx.showToast({
        title: '请选择贷款期限！',
        icon: 'none'
      })
      return;
    }
    if (carSelectData) {
      switch (carSelectData) {
        case "单辆车":
          carSelectData = 1;
          break;
        case "暂无车":
          carSelectData = 2;
          break;
        case "多辆车":
          carSelectData = 3;
          break;
        default:
          break;
      }
    }

    params.loanName = usernameValue; //用户姓名
    params.loanPhone = telValue; //申贷人手机号   填
    params.floadPhone = wx.getStorageSync('user').mobile; //发起人手机号 缓存
    params.carType = carSelectData; //车辆情况
    params.loanMoney = moneyValue; //贷款金额
    params.regionInfo = locationSelectData; //意向区域
    params.loanTime = deadlineSelectData.split("年")[0]; //申请期限
    // console.log(params);

    wx.request({
      url: app.url + '/product/auth0/loanInfo/addData',
      header: {
        token: app.gettoken()
      },
      method: "post",
      data: params,
      success: (res) => {
        console.log(res);
        if (res.data.code === 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
          this.setData({
            usernameValue: "",
            telValue: "",
            moneyValue: "",
            carSelectData: "",
            locationSelectData: "",
            deadlineSelectData: ""
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gainLocationMsg();
  },
  /**
   * 获取区层栋
   */
  gainLocationMsg: function () {
    let projectId = wx.getStorageSync('dataid');
    let params = new Array(3);
    let level1 = [];
    let level2 = [];
    let level3 = [];
    let count = 0;
    //一级区域
    wx.request({
      url: app.url + '/product/auth0/truckSpaceArea/selectMiniAllList',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId
      },
      success: res => {
        if (res.data.code == 0) {
          let result = res.data.data
          result.forEach(item => {
            level1.push(item.name)
          })
          params[0] = level1;
          count++;
          if (count === 3) {
            this.setData({
              locationPickerData: params
            })
            this.selectComponent(".location").setDetailPrice()
          }
        }
      }
    })
    //二级区域
    wx.request({
      url: app.url + '/product/auth0/TruckSpaceLevelThree/doMiniSelectAllList',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId
      },
      success: res => {
        if (res.data.code == 0) {
          let result = res.data.data
          result.forEach(item => {
            level2.push(item.name)
          })
          params[2] = level2;
          count++;
          if (count === 3) {
            this.setData({
              locationPickerData: params
            })
            this.selectComponent(".location").setDetailPrice()
          }
        }
      }
    })
    //三级区域
    wx.request({
      url: app.url + '/product/auth0/TruckSpaceLevelTwo/doSelectMiniAllList',
      header: {
        token: app.gettoken()
      },
      data: {
        projectId
      },
      success: res => {
        if (res.data.code == 0) {
          let result = res.data.data
          result.forEach(item => {
            level3.push(item.name)
          })
          params[1] = level3;
          count++;
          if (count === 3) {
            this.setData({
              locationPickerData: params
            })
            this.selectComponent(".location").setDetailPrice()
          }
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})