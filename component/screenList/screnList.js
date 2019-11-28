// component/scrennList/screnList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      tagList:{
        type:JSON,
        value:''
      },
    showRight1:{
      type:Boolean,
      value:false
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
    moreSelect() {  //选择楼栋
      this.setData({
        showRight1: !this.data.showRight1,
    
      })
    },

    toggleRight1() {
      this.setData({
        showRight1: !this.data.showRight1,
      })
    },
    morescreen(e) {
      var title = e.currentTarget.dataset.title

      if (title == '更多筛选') {
        var tieleindex = e.currentTarget.dataset.tieleindex
        var index1 = e.currentTarget.dataset.index
        var item = this.data.tagList
        item[tieleindex].tagRespDtos[index1].isSelected = !item[tieleindex].tagRespDtos[index1].isSelected
        this.setData({
          tagList: item
        })
    
      }
    },
    corfim() {
      this.triggerEvent('corfim', this.data.tagList)
    }
  }
  
})
