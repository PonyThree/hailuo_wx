var app = getApp();
var timer;
var nowTime;
var getTag = require('../../../utils/getTag.js') //引入车位标签
var searhlist = require('../../../utils/serch.js') //引入车位标签
Page({
  /**
   * 页面的初始数据
   */
  data: {
    projectId: '',
    name: '',
    onlySelling: 0,
    // 开盘倒计时 0未开盘 1已开盘 2已过期
    openStatus: '',
    projectName: '',
    //开盘时间
    startTime: '',
    countDown: '',
    //开盘倒计时
    msg: '',
    truckSpaces: [{
      nodeRespDtos: []
    }],
    level1: [],
    level2: [],
    level3: [],
    radio: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.setData({
      projectId: e.projectId
    })
    app.stopShare();
    this.push();
    this.renderTime();
    getTag(e.projectId, this)  //获取车位区层栋标签
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(timer);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    setTimeout(() => {
      app.stopre()
    }, 1000)
    this.setData({
      pageSize: 1
    })
    let data = this.data.searchcriteria
    data.pageSize = this.data.pageSize
  searhlist(data,true,this)

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.carlist==false) {
      this.setData({
        tip: true
      })
      return
    }
    this.setData({
      showloding: true,
      pageSize: this.data.pageSize += 1
    })
    let data = this.data.searchcriteria
    data.pageSize = this.data.pageSize
     searhlist(data,false,this)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  //筛选列表加载

  // 用来控制筛选的抽屉
  showSelect() {
    console.log('抽屉出现');
    this.setData({
      showRight1: !this.data.showRight1
    })
  },
  toggleRight1() {
    this.setData({
      showRight1: !this.data.showRight1
    })
  },
  // 收藏跳转
  change1() {
    wx.navigateTo({
      url: '/pages/opening/collection/collection?projectId=' + this.data.projectId,
    })
  },
  // 只看待售
  choose() {
    clearInterval(timer);
    this.setData({
      radio: this.data.radio == 1 ? 0 : 1
    })
    this.push()
  },
  // 跳转到真实开盘出价页面
  gobid(e) {
    clearInterval(timer);
    console.log(e)
    if (e.currentTarget.dataset.sellstatus == 2 || e.currentTarget.dataset.sellstatus == 3) {
      wx.showToast({
        title: '车位已售出',
        icon: 'none'
      })
      return
    }
    var id = e.currentTarget.dataset.id;
    var projectId = e.currentTarget.dataset.projectid
    console.log(projectId)
    wx.navigateTo({
      url: '/pages/opening/bid/bid?carid=' + id + '&projectId=' + projectId
    })
  },

  //楼栋筛选
  morescreen(e) {
    console.log(e)
    var title = e.currentTarget.dataset.title
    if (title == '组团') {
      //   console.log('这是区域')
      var index = e.currentTarget.dataset.index;
      var item = this.data.level1[index];
      item.isSelected = !item.isSelected;
      this.setData({
        level1: this.data.level1
      })
    } else if (title == '楼层') {

      var index = e.currentTarget.dataset.index;
      var item = this.data.level2[index];
      item.isSelected = !item.isSelected;
      this.setData({
        level2: this.data.level2
      })
    } else if (title == '楼栋') {
      var index = e.currentTarget.dataset.index;
      var item = this.data.level3[index];
      item.isSelected = !item.isSelected;
      this.setData({
        level3: this.data.level3
      })

    }
    console.log(this.data);
  },
  //筛选提交
  push() {
    wx.hideLoading()
    this.data.showRight1 = !this.data.showRight1;
    var level1 = [] //区域id
    var level2 = [] //楼层id
    var level3 = [] //楼栋id
    let list1 = this.data.level1
    let list2 = this.data.level3
    let list3 = this.data.level2
    list1.map(i => {
      if (i.isSelected) {
        level1.push(i.id)
      }
    })
    list2.map(i => {
      if (i.isSelected) {
        level2.push(i.id)
      }
    })
    list3.map(i => {
      if (i.isSelected) {
        level3.push(i.id)
      }
    })
    let data = {
      projectId: this.data.projectId,
      level1,
      level2,
      level3,
      onlySelling: this.data.radio,
      pageSize: 1
    }
     searhlist(data,true,this)
    this.setData({
      searchcriteria: data,
      showRight1: false,
      showRight2: false,
      pageSize: 1
    })
  },
  //列表数据
  renderData(data) {
    var that = this;
    wx.request({
      method: 'post',
      url: app.url + "/product/auth0/truckSpace/conditionSearch",
      header: {
        token: app.gettoken(),
      },
      data: data,
      success: res => {

        this.setData({
          carList: res.data.data,
          showloding: false, //加载提示
          tip: false //无更多数据提示
        })
      }
    })
  },
  addZero(n) {
    return n < 10 ? '0' + n : n;
  },
  // 时间戳转时间函数
  transformDate(time) {
    var t = new Date(time);
    var y = t.getFullYear();
    var mon = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    return y + '-' + this.addZero(mon) + '-' + this.addZero(d) + " " + this.addZero(h) + ":" + this.addZero(m) + ":" + this.addZero(s);
  },
  cutDownDate(time) {
    // console.log(time,this.data.msg);
    if (time == 0) {
      this.data.openStatus = 1;
      return;
    }
    var d = Math.floor(time / 1000 / 60 / 60 / 24);
    var hour = Math.floor(time / 1000 / 60 / 60 % 24);
    var min = Math.floor(time / 1000 / 60 % 60);
    var sec = Math.floor(time / 1000 % 60);
    return d + '天' + hour + "小时" + min + "分" + sec + "秒";
  },
  //头部时间数据
  renderTime() {
    var that = this;
    clearInterval(timer)
    wx.request({
      method: 'post',
      url: app.url + '/project/auth0/miniProject/openDetail/' + this.data.projectId,
      header: {
        token: app.gettoken()
      },
      success: res => {
        //开盘时间
        var openStartTime = that.transformDate(res.data.data.startTime);
        nowTime = app.newDate();
        that.setData({

          openStatus: res.data.data.openStatus,
          startTime: openStartTime,
          projectName: res.data.data.projectName,
          msg: that.cutDownDate(res.data.data.startTime - nowTime)
        });
        //倒计时 countDown
        nowTime = app.newDate();
        let countDown = res.data.data.startTime - nowTime;
        that.data.countDown = countDown;
        if (this.data.openStatus == 0) {
          timer = setInterval(() => {
            var msg = this.cutDownDate(that.data.countDown -= 1000)
            if (that.data.countDown <= 0) { //倒计时结束重新加载页面
              clearInterval(timer)
              this.setData({
                openStatus: 1
              })
            }
            this.setData({
              msg: msg
            });
          }, 1000);
        }
      }
    })
  },
  //刷新
  fresh() {
    console.log('刷新');
    wx.showLoading({
      title: '数据加载中...',
      duration: 1000,
    });
    let clock = setTimeout(() => {
      this.renderTime();
      wx.hideLoading();
      clearInterval(clock)
    }, 2000)

  },
  //
  Reload() { //重新加载.
    wx.showLoading({
      title: '加载中..',
    })
    let data={
      projectId:this.data.projectId
    }
    searhlist(data,true,this)
  

  },
})