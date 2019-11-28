// component/step/step.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: JSON,
      value:{}
    },
   
    youhui: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: false
    },
    actityInfo:{
      type: Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: true,

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      console.log(this.data.data)
      let steps = this.getstep(this.data.data) //获取步骤条状态
      this.setData({
        steps
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getstep(data) { //获取步骤条的状态
      let textJson = []
      if (data.controlRespDto.locationStatus) {
        textJson.push({
          text: '线上落位',
          desc: `线上支付落位金`
        })
      }
      if (data.controlRespDto.onlineBuyStatus) {
        textJson.push({
          text: `线上${data.controlRespDto.buyName}`,
          desc: `线上支付${data.controlRespDto.buyMoneyName}`
        })
      }
      textJson.push({
        text: '系统审核',
        desc: `项目方审核您的订单后,可进行线下签约`
      })
      textJson.push({
        text: '线下签约',
        desc: `线下核销二维码完成合同签约`
      })

      return textJson
    },
    bind() {
      this.setData({
        type: !this.data.type
      })
    },
    showPrice() { //显示计算价格
      this.setData({
        show: true
      })
    },
    onClose() {
      this.setData({
        show: false
      })
    },
    gosubscription() { //跳转到认购页面
      wx.navigateTo({
        url: '/pages/order/subscription/subscription?carid=' + this.data.data.id,
      })
    },


  }
})