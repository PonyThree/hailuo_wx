
const app=getApp();
Component({
    //组件属性
    properties: {
        gosearch:{
            type:Boolean,
            value:false
        }
    },
    //组件的方法
    methods: {
        gosearch(e) {
            this.setData({
                gosearch:true
            })
            var {value:searchValue}=e.detail;
            // console.log(searchValue)
            this.triggerEvent('gosearch', { searchValue}, { bubbles: true, composed: true})
        }
    }
})