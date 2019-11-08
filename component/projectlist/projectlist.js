// component/projectlist/projectlist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    positionList: {
      type: JSON,
      value: 'default value'
    },
      showCode:{
          type:Boolean,
          value:false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //   showCode:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    project(e){
      console.log(e)
      let titlename = e.currentTarget.dataset.titlename
        // console.log(titlename)
      if (e.currentTarget.dataset.localstatus==1) {  //是否需要扫码
        // wx.showModal({
        //   title: '车位仅限本小区业主购买',
        //   content: '请联系职业顾问扫码添加项目',
        //   success(res) {
        //     if (res.confirm) {
                
        //     } 
        //   }
        // })
          this.setData({
              showCode:true
          })
        console.log('启用扫码功能')
        return 
      }
      let id = e.currentTarget.dataset.id
        wx.setStorageSync('dataid', id)
      wx.request({
        url: app.url + '/user/userProject/auth0/addProjectForUser',
        header: {
          token: app.gettoken(),
        },
        method: "post",
        data: {
          projectId: id
        },
        success: res => {
          if (res.data.code == 0) {
           
          }
        }
      })  
    //   wx.navigateTo({
    //     url: '/pages/firstPage/projectIndex/projectIndex?projectId='+id
    //   })
    wx.switchTab({
        url: '/pages/firstPage/projectIndex/projectIndex',
    })
    },
    //蒙层关闭时触发事件
    onClose(e) {
        var that = this;
        that.setData({
            showCode: false
        })
    },
    //扫码
      scanCode(e){
          wx.navigateTo({
              url: '/pages/project/Switchingitems/Switchingitems?from=projectList',
          })
          this.onClose()
      },
    //   取消
      cancle(){
          console.log('点击取消按钮')
          this.onClose()
      },
    //   确定
      confirm(){
       
         this.scanCode()
      }
  }
})
