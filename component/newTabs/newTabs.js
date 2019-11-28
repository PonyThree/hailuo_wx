const app = getApp()
Component({
  //组件属性
  properties:{
    tabList:{
      type:'JSON',
      value:['未使用','已使用','已过期','不清楚']
    },
    actNnum:{
      type:'string',
      value:'0'
    }
  },
  methods:{
    handleTap(e){
      // console.log(e)
      this.setData({
        actNnum: e.currentTarget.dataset.num
      })
      this.triggerEvent('choseNum', this.data.actNnum)
    }
  }
})