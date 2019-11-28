// component/orderComponent/purchaseInformation/purchaseInformation.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{  //车位数据
      type:JSON,
      value:{}
    },
    consultantlist:{  //职业顾问信息
      type:Array,
      value:[]
    },
    orderlist:{  //订单信息
      type: JSON,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    username: wx.getStorageSync('wx').nickName,
    contractName: wx.getStorageSync('wx').nickName,
    contractMobile: wx.getStorageSync('user').mobile,
  },
  observers:{
    'orderlist': function (orderlist){
      if (orderlist ){
     
        this.setData({
          contractName: orderlist.contractName,
          contractMobile: orderlist.contractMobile,
          contractIdcard: orderlist.contractIdcard
        })
       
      }
    
      },
      'data':function(data){
        if (data) {
          //获取职业顾问
          app.http('get', '/consultant/auth0/consultant/findByProject', { projectId: this.data.data.projectId }).then(res => {
            this.setData({
              consultantlist: res.data.data
            })
          })
        }
      }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onshow() {
      this.setData({
        show: true
      });
    },
    onClose() {
      this.setData({
        show: false,
        show2: false,
        show1: false
      });
    },
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
    call() {   //拨打职业顾问电话
      wx.makePhoneCall({
        phoneNumber: this.data.consultantlist[0].phone,
     
      })
    },
    getContract(){//返回签约人信息
      let list={
        contractMobile: this.data.contractMobile,
        contractName: this.data.contractName,
        contractIdcard: this.data.contractIdcard
      }

      return list

      
    
    }
  }
})
