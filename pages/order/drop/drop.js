// pages/order/drop/drop.jscons
const app = getApp()
const md5 = require('../../../utils/md5.js')
var timeint, paytime
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showRg: false,
        msg: '',
        username: wx.getStorageSync('wx').nickName,
        contractName: wx.getStorageSync('wx').nickName,
        contractMobile: wx.getStorageSync('user').mobile,
        Personal1: '0',
        fruit: [{
            id: 1,
            name: '钱包(￥)',
        }, {
            id: 2,
            name: '微信支付'
        }],
        current: '微信支付',
        position: 'right',
        time: 180,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        //设置倒计时关闭页面
        this.countdown(this.data.time)
        app.stopShare();
        wx.request({
            url: app.url + '/product/auth0/miniTruckSpace/' + e.carid,
            method: 'post',
            header: {
                token: app.gettoken()
            },
            success: res => {
                if (res.data.code == 0) {
                    this.setData({
                        data: res.data.data
                    })
                    this.getmoeny() //查询项目可用余额
                    this.getorder(this.data.carid) //根据车位ID判断有无订单
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getpassword() //判断用户有无支付密码
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        clearInterval(paytime)
      clearInterval(timeint);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(paytime)
      clearInterval(timeint);
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
    // 落位支付成功
    godropsuccess() {
        var that = this;
        if (!this.data.Agreement) {
            wx.showToast({
                title: '请勾选同意用户协议',
                icon: 'none'
            })
            return
        }
      var data = this.selectComponent("#getContract").getContract()
          data.truckSpaceId = this.data.data.id

        if (this.data.data.controlRespDto.downMoney == 0) { //0元
          data.downSpaceType=3
            wx.request({
                url: app.url + '/product/auth0/userDownTruckSpace',
                method: "post",
                header: {
                    token: app.gettoken()
                },
                data: data,
                success: res => {
                    if (res.data.code == 0) {
                        wx.navigateTo({
                            url: '/pages/order/dropsuccess/dropsuccess?orderNo=' + res.data.data.orderNo,
                        })
                        wx.showToast({
                            title: '下单成功',

                        })
                    } else {
                        // wx.showToast({
                        //   title: res.data.msg,
                        //   icon: "none"
                        // })
                        that.setData({
                            showRg: true,
                            msg: res.data.msg
                        })
                    }
                }
            })

            return
        }
        if (this.data.data.freeDownNum != 0) { //免费落位
          data.downSpaceType=3
            wx.showModal({
                title: '您还可以免费落' + this.data.data.freeDownNum + '个位',
                content: '是否确定订单',
                success: (res) => {
                    if (res.confirm) {
                        wx.request({
                            url: app.url + '/product/auth0/userDownTruckSpace',
                            method: "post",
                            header: {
                                token: app.gettoken()
                            },
                            data:data,
                            success: res => {
                                if (res.data.code == 0) {
                                    wx.navigateTo({
                                        url: '/pages/order/dropsuccess/dropsuccess?orderNo=' + res.data.data.orderNo,
                                    })
                                    wx.showToast({
                                        title: '下单成功',

                                    })
                                } else {
                                    that.setData({
                                        showRg: true,
                                        msg: res.data.msg
                                    })
                                }
                            }
                        })

                    }
                }
            })
            return
        }

        if (this.data.current != '微信支付') { //钱包支付
        data.downSpaceType=1
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
            if (this.data.money < this.data.data.controlRespDto.downMoney) {
                wx.showToast({
                    title: '钱包余额不足,请充值或者选择微信支付',
                    icon: 'none'
                })
                return
            }

            wx.request({
                url: app.url + '/product/auth0/userDownTruckSpace',
                method: "post",
                header: {
                    token: app.gettoken()
                },
                data: data,
                success: res => {
                    if (res.data.code == 0) {
                        console.log(res)
                        this.setData({
                            show2: 1
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none"
                        })
                    }
                }
            })
        } else { //微信支付
            wx.showLoading({
                title: '加载中',
            })
            data.downSpaceType=2
            wx.request({
                url: app.url + '/product/auth0/userDownTruckSpace',
                method: "post",
                header: {
                    token: app.gettoken()
                },
                data:data,
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
                                                    url: '/pages/order/dropsuccess/dropsuccess?orderNo=' + req.orderNo,
                                                })
                                            } else if (res.data.code != 15) {
                                                wx.hideLoading()
                                                // 支付失败,弹出层
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
    // 选择支付方式
    handleFruitChange({
        detail = {}
    }) {
        console.log(detail)
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


    //倒计时结束关闭页面
    countdown(time) {
      clearInterval(timeint);
        timeint = setInterval(() => {
            time -= 1
            this.setData({
                time
            })
            if (time < 1) {
                clearInterval(timeint);
                wx.showModal({
                    title: '落位失败',
                    content: "订单付款时间已过,将为您取消订单",
                    showCancel: false,
                    success() {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        }, 1000)
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
                    if (res.data.data > this.data.data.controlRespDto.downMoney) { //判断默认支付方式
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
    //格式化时间
    gettime: function(my_time) {
        var days = my_time / 1000 / 60 / 60 / 24;
        var daysRound = Math.floor(days);
        var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
        var hoursRound = Math.floor(hours);
        var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
        var minutesRound = Math.floor(minutes);
        var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        this.setData({
            djs: daysRound + '天' + hoursRound + '小时' + minutesRound + '分' + Math.floor(seconds) + '秒',

        })
    },
    // 弹起密码框
    pay(e) {
        console.log(e);
        // 模态交互效果
        this.setData({
            psw: e.detail,
            show2: false
        })
        wx.request({
            url: app.url + '/product/auth0/userChangeDownPay',
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
                        url: '/pages/order/dropsuccess/dropsuccess?orderNo=' + res.data.data.orderNo,
                    })
                    wx.showToast({
                        title: '支付成功',

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
   
    //根据车位ID获取订单信息
    getorder(id) {
        wx.request({
            url: app.url + '/order/auth0/orderForm/orderInfoByTruckSpaceId/' + id,
            method: 'get',
            header: {
                token: app.gettoken(),
            },
            success: res => {}
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
    goAgreement() { //跳转到用户落位协议
        wx.navigateTo({
            //落位type 1  认购type 2
            url: '/pages/order/Agreement/Agreement?projectId=' + this.data.data.projectId + "&type=1",
        })

    },

})