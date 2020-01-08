const app = getApp()

function pay(data,from='认购') { //落位发起支付
  wx.showLoading({
    title: '请等待',
  })
  app.http('post', '/order/auth0/truckSpaceOrder/payOrder', data, false).then(res => {
    wx.hideLoading()
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: 'prepay_id=' + res.data.data.prepayId,
        signType: 'MD5',
        paySign: res.data.data.paySign,
        success: function(req) {
          wx.showLoading({
            title: '正在处理', 
          })
          getstates(res, from)
        },
        fail: function(req) {
          wx.redirectTo({
            url: `/pages/order/realpay/realpay?orderid=${res.data.data.baseOrderId}`,
          })
        },
      })
     
  })
}

function getstates(res,from){
  setTimeout(_=>{
    //支付成功跳转
    wx.request({
      url: app.url+'/order/auth0/truckSpaceOrder/regPaySuccess',
      method:'post',
      data: { baseOrderId: res.data.data.baseOrderId},
      header:{
        token: app.gettoken(),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(req){
        wx.hideLoading()
        if (req.data.code == 0) {
          if (from == '落位') {
            wx.redirectTo({
              url: `/pages/order/dropsuccess/dropsuccess?orderid=${res.data.data.baseOrderId}`,
            })
          }
          if (from == '认购') {
            wx.redirectTo({
              url: `/pages/order/subscriptionsuccess/subscriptionsuccess?orderid=${res.data.data.baseOrderId}`,
            })
          }

        }
        else if(req.data.code==4){
          getstates(res, from)
        }
        else {
          wx.showModal({
            title: '支付失败',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
    // app.http('post', `/order/auth0/truckSpaceOrder/regPaySuccess`, { baseOrderId: res.data.data.baseOrderId }).then(_ => {
    //   wx.hideLoading()
    //   if (res.data.code == 0) {
    //     if (from == '落位') {
    //       wx.redirectTo({
    //         url: `/pages/order/dropsuccess/dropsuccess?orderid=${res.data.data.baseOrderId}`,
    //       })
    //     }
    //     if (from == '认购') {
    //       wx.redirectTo({
    //         url: `/pages/order/subscriptionsuccess/subscriptionsuccess?orderid=${res.data.data.baseOrderId}`,
    //       })
    //     }

    //   }
    //   else {
    //     wx.showModal({
    //       title: '支付失败',
    //       content: res.data.msg,
    //       showCancel: false
    //     })
    //   }

    // })
  },1000)
}

module.exports = {
  pay: pay
  
}