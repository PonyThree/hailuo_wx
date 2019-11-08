// pages/order/drop/drop.js
const app = getApp()
const md5 = require('../../../utils/md5.js')
var paytime
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRg: false,
        userName: wx.getStorageSync('wx').nickName,
        contractName: wx.getStorageSync('wx').nickName,
        contractMobile: wx.getStorageSync('user').mobile,
        Personal1: '0',
        //传递给认购协议title
        buyName:'',
        fruit: [{
            id: 1,
            name: '钱包(￥)',
        }, {
            id: 2,
            name: '微信支付'
        }],
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
    onLoad: function(e) {
        console.log(e)
        if (e.orderNo) this.setData({
            orderNo: e.orderNo
        })
        if (e.carid) this.setData({
            carid: e.carid
        })
        else {
          this.setData({
            carid: '3684616801641037824'
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
    onShow: function() {
        this.getorderlist() //获取订单详情
        this.getcarlist(this.data.carid) //获取车位详情
        this.getpassword() //判断有无支付密码
        //禁用转发
        app.stopShare();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        clearInterval(paytime)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(paytime)
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
    // 认购支付成功
    godropsuccess() {
        var that = this;
        if (!this.data.Agreement) {
            wx.showToast({
                title: '请勾选同意用户协议',
                icon: 'none'
            })
            return
        }
        if (this.data.data.controlRespDto.buyMoney == 0) { //0元认购
            wx.request({
                url: app.url + '/product/auth0/subPayTruckSpace',
                method: "post",
                header: {
                    token: app.gettoken()
                },
                data: {
                    "truckSpaceId": this.data.data.id,
                    contractIdcard: this.data.contractIdcard,
                    contractMobile: this.data.contractMobile,
                    contractName: this.data.contractName,
                    type: 3

                },
                success: res => {
                    if (res.data.code == 0) {
                        wx.navigateTo({
                            url: '/pages/order/subscriptionsuccess/subscriptionsuccess?orderNo=' + res.data.data.orderNo,
                        })
                    } else {
                        // 支付失败,弹出层
                        that.setData({
                            showRg: true,
                            msg: res.data.msg
                        })
                    }
                }
            })
            return
        }

        if (this.data.current != '微信支付') { //钱包支付
            if (!this.data.payPassword) { //判断有无支付密码
                wx.showModal({
                    title: '您还未设置支付密码',
                    content: '请设置支付密码',
                    confirmColor: '##5DD4A4',
                    success: res => {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/my/SetPassword/SetPassword',
                            })
                        }
                    }
                })
                return
            }
            if (this.data.money < this.data.data.controlRespDto.buyMoney) {
                wx.showToast({
                    title: '钱包余额不足,请充值或者选择微信支付',
                    icon: 'none'
                })
                return
            }
            wx.request({
                url: app.url + '/product/auth0/subPayTruckSpace',
                method: "post",
                header: {
                    token: app.gettoken()
                },
                data: {
                    "truckSpaceId": this.data.data.id,
                    contractIdcard: this.data.contractIdcard,
                    contractMobile: this.data.contractMobile,
                    contractName: this.data.contractName,
                    type: 1,
                    activityPrice: this.data.data.actityInfo.seckillPrice || null,
                    activityDiscountPrice: this.data.data.actityInfo.reducePrice || null,

                },
                success: res => {
                    if (res.data.code == 0) {
                        console.log(res)
                        this.setData({
                            show2: 1
                        })

                    } else {
                        that.setData({
                            showRg: true,
                            msg: res.data.msg
                        })
                    }
                }
            })
        } else { //微信支付
            wx.showLoading({
                title: '加载中',
            })
            wx.request({
                url: app.url + '/product/auth0/subPayTruckSpace',
                method: "post",
                header: {
                    token: app.gettoken()
                },
                data: {
                    "truckSpaceId": this.data.data.id,
                    contractIdcard: this.data.contractIdcard,
                    contractMobile: this.data.contractMobile,
                    contractName: this.data.contractName,
                    type: 2,
                  activityPrice: this.data.data.actityInfo.seckillPrice||null,
                  activityDiscountPrice: this.data.data.actityInfo.reducePrice || null,

                },
                success: res => {

                    wx.hideLoading()
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
                                paytime = setInterval(() => { //一直获取订单回调 直到后台订单响应
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
                                                    url: '/pages/order/subscriptionsuccess/subscriptionsuccess?orderNo=' + req.orderNo,
                                                })
                                            } else if (res.data.code != 15) {
                                                wx.hideLoading()
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
        }


    },
    // 顶部时间弹出
    showtimetop() {
        this.setData({
            showtimetop: !this.data.showtimetop
        })
    },
    // 选择支付方式
    handleFruitChange({
        detail = {}
    }) {
        this.setData({
            current: detail.value
        });
    },
    // 是否同意用户协议
    handleAnimalChange({
        detail = {}
    }) {
        this.setData({
            Agreement: detail.current
        });
    },
    // 修改签约人信息
    onshow() {
        this.setData({
            show: true
        });
    },
    onClose() {
        this.setData({
            show: false,
            show1: false,
            show2: false
        });
    },
    //修改签约人信息
    value2(e) {
        console.log(e)
        let value = e.detail.detail.value
        this.setData({
            contractName: value
        })
    },
    value3(e) {
        let value = e.detail.detail.value
        this.setData({
            contractMobile: value
        })
    },
    value4(e) {
        let value = e.detail.detail.value
        this.setData({
            contractIdcard: value
        })
    },

    //选择职业顾问
    onshow1() {
        this.setData({
            show1: true
        });
    },

    onClick(e) {
        console.log(e)
        this.setData({
            Personal1: e.currentTarget.dataset.name,
            Personalid: e.currentTarget.dataset.id,
            show1: false
        })
        this.bindPersonal(e.currentTarget.dataset.id)
    },
    //获取职业顾问信息
    getPersonal() {

        wx.request({
                url: app.url + '/consultant/auth0/consultant/findByProject',
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
                            consultantlist: res.data.data
                        })
                    }
                }
            }),
            //获取签约人信息

            wx.request({
                url: app.url + '/order/auth0/orderForm/findDownSpace',
                method: 'get',
                header: {
                    token: app.gettoken()
                },
                data: {
                    truckSpaceId: this.data.data.id
                },
                success: res => {
                    if (res.data.code == 0 && res.data.data != null) {
                        this.setData({
                            contractName: res.data.data.contractName == '' ? this.data.contractName : res.data.data.contractName,
                            contractMobile: res.data.data.contractMobile == '' ? this.data.contractName : res.data.data.contractMobile,
                            contractIdcard: res.data.data.contractIdcard
                        })
                    }
                }
            })
    },
    //获取订单信息
    getorderlist() {
        //获取订单信息
        wx.request({
            url: app.url + '/order/auth0/orderForm/' + this.data.orderNo,
            method: 'get',
            header: {
                token: app.gettoken()
            },
            success: res => {
                if (res.data.code == 0) {
                    this.setData({
                        orderlist: res.data.data
                    })

                } else if (res.data.code != 15) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
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
                    if (res.data.data > this.data.data.controlRespDto.buyMoney) { //判断默认支付方式
                        this.setData({
                            current: '钱包(￥)'
                        })
                    }
                    this.setData({
                        fruit: [{
                            id: 1,
                            name: '钱包(￥' + res.data.data + ')',
                        }, {
                            id: 2,
                            name: '微信支付'
                        }],
                        money: res.data.data
                    })
                }
            }
        })
    },
    //获取车位相信信息
    getcarlist(carid) {
        //获取车位详情
        wx.request({
            url: app.url + '/product/auth0/miniTruckSpace/' + carid,
            method: 'post',
            header: {
                token: app.gettoken()
            },
            success: res => {
                if (res.data.code == 0) {
                    this.setData({
                        data: res.data.data,
                        buyName: res.data.data.controlRespDto.buyName
                    })
                    this.getPersonal() //获取职业顾问信息
                    this.getmoeny() //获取钱包余额
                }
            }
        })
    },
    // 弹起密码框
    valueSix(e) {
        console.log(e);
        // 模态交互效果
        this.setData({
            psw: e.detail,
            show2: false
        })
        wx.request({
            url: app.url + '/product/auth0/userChangeSubPay',
            method: 'post',
            header: {
                token: app.gettoken()
            },
            data: {
                truckSpaceId: this.data.data.id,
                payPassword: md5.hexMD5(this.data.psw)
            },
            success: res => {

                if (res.data.code == 0) {
                    wx.navigateTo({
                        url: '/pages/order/subscriptionsuccess/subscriptionsuccess?orderNo=' + res.data.data.orderNo,
                    })
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
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
    //拨打职业顾问电话
    call() {
        wx.makePhoneCall({
            phoneNumber: this.data.consultantlist[0].phone,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    //绑定专属职业顾问
    bindPersonal(consultantId) {
        wx.request({
            url: app.url + '/project/auth0/projectUser/setConsultantForProjectUser',
            method: 'get',
            header: {
                token: app.gettoken(),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                projectId: this.data.data.projectId,
                consultantId: consultantId
            },
            success: res => {
                this.getPersonal()
            }
        })
    },
    // 判断有无支付密码
    getpassword() {
        wx.request({
            url: app.url + '/user/auth0/user/hasSetPayPassword',
            method: 'get',
            header: {
                token: app.gettoken()
            },
            success: res => {
                if (res.data.code == 0) {
                    this.setData({
                        payPassword: res.data.data
                    })

                }
            }
        })
    },
    goAgreement() { //跳转到用户认购协议
        wx.navigateTo({
            //落位type 1  认购type 2
            url: '/pages/order/Agreement/Agreement?projectId=' + this.data.data.projectId + "&type=2" + "&buyName=" + this.data.buyName,
        })

    }
})