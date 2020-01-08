// component/crowdfunding/activityInfo/activityInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     *  例:
     *  message: "恭喜您活动成功，去领奖励吧！",
     *  type: "about",
     *  activityTime: "2019 12 25 08:00"
     */
    data: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBool: "about",
    infoText: "",
    originTimestamp: "",
    day: "",
    hours: "",
    minute: "",
    second: "",
    timer: null
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let {
        message = "0.0",
          type = "type",
          activityTime = null
      } = this.data.data;
      let originTimestamp = new Date(activityTime).getTime();
      if (activityTime) {
        // 计算时间
        this.setData({
          timer: setInterval(() => {
            let targetTimestamp = new Date().getTime();
            let differTimestamp = originTimestamp - targetTimestamp;
            let disfferDate = new Date(differTimestamp);
            let day = Math.floor(disfferDate / 1000 / 60 / 60 / 24);
            let hours = Math.floor(disfferDate / 1000 / 3600 - day * 24);
            let minute = Math.floor(disfferDate / 1000 / 60 - (day * 1440 + hours * 60));
            let second = Math.floor(disfferDate / 1000 - (minute * 60 + day * 86400 + hours * 3600));
            if (day < 0) {
              day = "00";
              hours = "00";
              minute = "00";
              second = "00";
              clearInterval(this.data.timer)
            } else {
              if (day < 10) {
                day = "0" + day
              }
              if (hours < 10) {
                hours = "0" + hours
              }
              if (minute < 10) {
                minute = "0" + minute
              }
              if (second < 10) {
                second = "0" + second
              }
            }

            this.setData({
              day,
              hours,
              minute,
              second
            })
          }, 1000)

        })
      }

      this.setData({
        infoText: message,
        showBool: type,
        originTimestamp
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log(this.data);

      clearInterval(this.data.timer)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  },

})