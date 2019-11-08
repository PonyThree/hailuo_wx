// component/opentime/opentime.js
const app = getApp()
var settime
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projectId:{
      type: String,
      value: '3683821216235257856'
  }
  },
  pageLifetimes: {
    show: function () {
      clearInterval(settime)
      wx.request({
        method: 'post',
        url: app.url + '/project/auth0/miniProject/openDetail/' + this.data.projectId,
        header: {
          token: app.gettoken()
        },
        success: res => {
          this.setData({
            opendata: res.data.data
          })
          this.gettime(res.data.data.mlStartTime)
        }
      })
    },
    ready:function(){
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  
  },
  methods: {
    gettime(time){  // 计算开盘时间倒计时
      if (time - app.newDate()>1000) { //未开盘
        let djs = this.cutDownDate(time - app.newDate())
        this.setData({
          djs
        })
        this.setData({
          status: 1
        })
        settime = setInterval(() => {
          if (time - app.newDate() < 1000) { //倒计时已结束
            clearInterval(settime)
            this.setstatus()//调用父组件存储
            this.setData({
              status: 2
            })
          }
          let djs = this.cutDownDate(time - app.newDate())
          this.setData({
            djs
          })
        }, 1000)

      } else {
        this.setData({
          status: 2
        })
        this.setstatus()//调用父组件存储

      };
    },
    setstatus(){
      this.triggerEvent('setstatus')
    },
    cutDownDate(time) {
      var d = Math.floor(time / 1000 / 60 / 60 / 24);
      var hour = Math.floor(time / 1000 / 60 / 60 % 24);
      var min = Math.floor(time / 1000 / 60 % 60);
      var sec = Math.floor(time / 1000 % 60);
      return d + '天' + hour + "小时" + min + "分" + sec + "秒";
    },
  },

})