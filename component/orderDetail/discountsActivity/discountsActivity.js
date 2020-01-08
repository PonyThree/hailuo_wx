// component/orderDetail/discountsActivity/discountsActivity.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    activityData: [{
      activityName: "拼团",
      info: "优惠金额 |￥5000",
      price: 100,
      flag: false
    }, {
      activityName: "众筹",
      info: "优惠金额 |￥5000",
      price: 100,
      flag: false
    }, {
      activityName: "秒杀",
      info: "优惠金额 |￥5000",
      price: 100,
      flag: false
    }, ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择活动
     */
    selectActivity(e) {
      let index = e.target.dataset.index;
      console.log(e);
      
      this.triggerEvent("select", {
        value: this.data.activityData[index],
        bool: !this.data.activityData[index].flag
      })
      this.setData({
        ['activityData[' + index + '].flag']: !this.data.activityData[index].flag
      })
    }
  }
})