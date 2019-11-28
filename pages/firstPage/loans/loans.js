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
    ],
    visitState: false,
    drawerBool: false
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
            drawerBool: false
          })
        } else {
          this.selectComponent(".car").hiddenAnimation(this, {
            carPickerBool: true,
            carSelectData: this.manageSelect(selectData),
            drawerBool: false
          })
        }
        break;
      case "location":
        if (ComponentBool && !selectData) {
          // 隐藏动画
          this.selectComponent(".location").hiddenAnimation(this, {
            locationPickerBool: true,
            drawerBool: false
          })
        } else {
          this.selectComponent(".location").hiddenAnimation(this, {
            locationPickerBool: true,
            locationSelectData: this.manageSelect(selectData),
            drawerBool: false
          })
        }
        break;
      case "deadline":
        if (ComponentBool && !selectData) {
          this.selectComponent(".deadline").hiddenAnimation(this, {
            deadlinePickerBool: true,
            drawerBool: false
          })
        } else {
          this.selectComponent(".deadline").hiddenAnimation(this, {
            deadlinePickerBool: true,
            deadlineSelectData: this.manageSelect(selectData),
            drawerBool: false
          })
        }
        break;
      default:
        break;
    }
    // setTimeout(() => {
    //   //判断信息的完整性 
    //   this.judgeMessageFull();
    // }, 500);
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
    //判断信息的完整性 
    // this.judgeMessageFull();

  },
  /**
   * 判断信息的完整性 
   */
  // judgeMessageFull: function () {
  //   let {
  //     usernameValue,
  //     telValue,
  //     moneyValue,
  //     carSelectData,
  //     locationSelectData,
  //     deadlineSelectData
  //   } = this.data;
  //   let arr = [usernameValue, telValue, moneyValue, carSelectData, locationSelectData, deadlineSelectData]
  //   if (!arr.includes("")) {
  //     this.setData({
  //       btnColorBool: true
  //     })
  //   }
  // },
  /**
   * 展示组件
   * */
  showPicker: function (e) {
    // console.log(e.target.dataset.tag);
    let tag = e.target.dataset.tag;
    this.setData({
      drawerBool: true
    })
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
    let projectId = wx.getStorageSync('dataid');
    let {
      usernameValue,
      telValue,
      moneyValue,
      carSelectData,
      locationSelectData,
      deadlineSelectData
    } = this.data;
    let cartype = "";
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
          cartype = 1;
          break;
        case "暂无车":
          cartype = 2;
          break;
        case "多辆车":
          cartype = 3;
          break;
        default:
          break;
      }
    }

    params.loanName = usernameValue; //用户姓名
    params.loanPhone = telValue; //申贷人手机号   填
    params.floadPhone = wx.getStorageSync('user').mobile; //发起人手机号 缓存
    params.carType = cartype; //车辆情况
    params.loanMoney = moneyValue; //贷款金额
    params.regionInfo = locationSelectData; //意向区域
    params.loanTime = deadlineSelectData.split("年")[0]; //申请期限
    params.projectId = projectId 
    // console.log(params);
    let options = {};
    options.loanName = usernameValue; //用户姓名
    options.loanPhone = telValue; //申贷人手机号   填
    options.floadPhone = wx.getStorageSync('user').mobile; //发起人手机号 缓存
    options.carType = carSelectData; //车辆情况
    options.loanMoney = moneyValue; //贷款金额
    options.regionInfo = locationSelectData; //意向区域
    options.loanTime = deadlineSelectData; //申请期限

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
            icon: 'loading',
            success: function () {
              wx.navigateTo({
                url: '/pages/firstPage/loans/submitSuccess/success?params=' + JSON.stringify(options)
              })
            }
          })
          // this.setData({
          //   usernameValue: "",
          //   telValue: "",
          //   moneyValue: "",
          //   carSelectData: "",
          //   locationSelectData: "",
          //   deadlineSelectData: ""
          // })
        } else {
          wx.showToast({
            title: res.data.msg,
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
    // 判断是否是第一次提交  false是true不是
    this.judgeEnterState()

  },
  /**
   * 回显数据
   */
  echoData: function () {
    let projectId = wx.getStorageSync('dataid');
    if (!this.data.visitState) {
      return false;
    }
    wx.request({
      url: app.url + '/product/auth0/loanInfo/getWxOneData?projectId='+projectId,
      header: {
        token: app.gettoken()
      },
      method: "get",
      success: (res) => {
        let result = res.data.data;
        this.setData({
          usernameValue: result.loanName,
          telValue: result.loanPhone,
          moneyValue: result.loanMoney,
          deadlineSelectData: result.loanTime + "年",
          locationSelectData: result.regionInfo,
          carSelectData: (function (value) {
            if (value === 1) {
              return "单辆车"
            } else if (value === 2) {
              return "暂无车"
            } else if (value === 3) {
              return "多辆车"
            }
          })(result.carType),
        })
      }
    })
  },
  /**
   * 判断进入状态
   */
  judgeEnterState: function () {
    let projectId = wx.getStorageSync('dataid');
    wx.request({
      url: app.url + '/product/auth0/loanInfo/userIsExist?projectId=' + projectId,
      method: "get",
      header: {
        token: app.gettoken()
      },
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            visitState: res.data.data
          }, () => {
            // 获取区层栋信息
            this.gainLocationMsg();
            // 获取提交的贷款信息
            this.echoData()
          })
        }
      }
    })
  },
  /**
   * 获取区层栋
   */
  gainLocationMsg: function () {
    if (this.data.visitState) {
      return false;
    }
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
        console.log(res.data)
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