// component/orderComponent/orderStep/orderStep.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:JSON,
      value:''
    },
    step:{
      type:String,
      value:''
    }
  },
  observers:{
      "data":function(data){
        if(data){
          this.setData({
            stepdata:data
          })
        }

     
      }  
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
  },
})
