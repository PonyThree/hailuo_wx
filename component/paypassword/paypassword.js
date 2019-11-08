// component/paypassword/paypassword.js
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
    Length: 6,      //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。  

  },

  /**
   * 组件的方法列表
   */
  methods: {
    Focus(e) {
      var that = this;
      console.log(e.detail.value);
      var inputValue = e.detail.value;
      if (inputValue.length==6){
    
        this.triggerEvent('parent', inputValue)
        this.triggerEvent('close')
      }
      that.setData({
        Value: inputValue,
      })
    },
    Tap() {
      var that = this;
      that.setData({
        isFocus: true,
      })
    },
    formSubmit(e) {
      console.log(e.detail.value.password);
  
    },

  }
})
