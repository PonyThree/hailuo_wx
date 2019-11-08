// pages/order/drop/drop.js
const app = getApp()
const md5 = require('../../../utils/md5.js')
var settime1, paytime, buyName
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buyName:'',
        showRg: '',
        msg: '',
        userName: wx.getStorageSync('user').name,
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

        if (e.orderNo) this.setData({
            orderNo: e.orderNo
        })
        if (e.carid) this.setData({
            carid: e.carid || '3653748341302362112',
            projectId: e.projectId,
            contractName: wx.getStorageSync('user').name,
            contractMobile: wx.getStorageSync('user').mobile

        })
        app.stopShare();
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getcarlist(this.data.carid) //获取车位详情
        // console.log()
        this.getpassword() //判断有无支付密码
        //项目开盘信息查询
        wx.request({
            method: 'post',
            url: app.url + '/project/auth0/miniProject/openDetail/' + this.data.projectId,
            header: {
              token: app.gettoken()
            },
            success: res => {
                if (res.data.code == 0) {
                    let openStatus = res.data.data.openStatus
                    let startTime = res.data.data.startTime
                    this.setData({
                        openStatus,
                        startTime
                    })
                    if (openStatus == 0) {
                        this.gettime(startTime - app.newDate() - 1000)
                        settime1 = setInterval(_ => {
                            if (startTime - app.newDate() <= 1500) {
                                
                                this.setData({
                                    openStatus: 1,
                                    
                                })
                               
                                clearInterval(settime1)


                            }
                            this.gettime(startTime - app.newDate() - 1000)


                        }, 1000)
                    }
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        clearInterval(settime1)
        clearInterval(paytime)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(settime1)
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
      // if (this.data.data.ableSub==false){
      //   wx.showToast({
      //     title: '抱歉,您暂时不能认购',
      //     icon:'none'
      //   })
      //   return
      // }
        var that=this;
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
                    type: 1

                },
                success: res => {
                    if (res.data.code == 0) {
                        console.log(res)
                        this.setData({
                            show2: 1
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
        } else { //微信支付
            //支付实验
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
                                                    url: '/pages/my/order/order'
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
                        // wx.showToast({
                        //   title: res.data.msg,
                        //   icon: 'none'
                        // })
                        that.setData({
                            showRg: true,
                            msg: res.data.msg
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
        this.setData({
            current: detail.value
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
                if (res.data.code == 0) {
                    buyName = res.data.data.controlRespDto.buyName;
                    this.setData({
                        data: res.data.data,
                        buyName:buyName
                    })
                    // console.log(buyName)
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
        if (this.data.data.collect) { //用户收藏了就删除
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

        } else {
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
    //格式化时间戳
    gettime: function(my_time) {
        var days = my_time / 1000 / 60 / 60 / 24;
        var daysRound = Math.floor(days);
        var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
        var hoursRound = Math.floor(hours);
        var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
        var minutesRound = Math.floor(minutes);
        var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        this.setData({
            djs: [daysRound, hoursRound, minutesRound, Math.floor(seconds)]

        })
    },
    //返回选位大厅
    goHall() {
        wx.navigateBack({
            delta: 1
        });
    },
    change1() { //跳转到收藏
        wx.navigateTo({
            url: '/pages/opening/collection/collection?projectId=' + this.data.projectId,
        })
    },
})