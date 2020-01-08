// component/group/recommend/recommend.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    marginBom:{
      type:'string',
      value:126
    },
    groupData:{
      type:Array,
      value:'defaullt value'
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
    goGroupAct(){
      console.log('去拼团活动')
      wx.navigateTo({
        url: '/pages/activity/MultiplayerGroup/MultiplayerGroup',
      })
    },
    joinGroup(){
      console.log('去参团')
      wx.navigateTo({
        url: '/pages/activity/MultiplayerGroup/groupDetails/groupDetails',
      })

    }
  }
})