Component({
    //组件属性
    properties:{
        //是否显示弹出层
        showRg:{
            type: Boolean,
            value:false,
            
        },
        msg:{
            type:String,
            value:'该车位已被认购'
        }
    },
    //组件的方法
    methods:{
        //蒙层关闭时触发事件
        onClose(e){
            var that=this;
            that.setData({
                showRg:false
            })
        },
        close(){
            var that = this;
            that.setData({
                showRg: false
            })
        }
    }
})