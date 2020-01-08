// component/orderDetail/orderDetail/orderDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
       {  
         salePrice:"",
         discountsPrice:"",
         endPrice:"",
          item:[{
            name: "认购金",
            price: 100,
            deduction: [{
              name: "落位金抵扣认购金",
              price: 100
            }]
          }]
        }
     */
    orderMessage: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBool: true,
  },
  lifetimes: {
    attached: function () {

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})