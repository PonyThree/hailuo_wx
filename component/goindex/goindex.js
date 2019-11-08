// component/goindex/goindex.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gotop:{
      type: Boolean,
      value: false
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
    //跳转到首页
    retures() {
      app.goindex()
    },
    gotop(){ //跳转到头部
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
  }
})
