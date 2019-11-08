// pages/opening/sellectionHall/sellectionHall.js
const app=getApp();
var getTag = require('../../../utils/getTag.js') //引入车位标签
Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectId:'',
        showRight1: false,
        //true 收藏状态激活  false 收藏状态失效 
        active1: false,
        //true 选位大厅状态激活  false 收藏状态失效 
        active2: true,
        //用来控制是否只看代售
        onlySelling:0,
        //楼栋列表
        parkList:[],
        // 筛选列表
        level1: [],
        level2: [],
        level3: [],
        pageSize:40
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
          projectId:options.projectId||'3674866207061704704'
    });
      getTag(options.projectId,this)
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
       
        //数据加载
        this.renderData();
        //头部时间数据加载
        this.renderTime();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    // 用来控制筛选的抽屉
    showSelect() {
        // console.log('抽屉出现');
        this.setData({
            showRight1: !this.data.showRight1
        })
    },
    //楼栋筛选 将点击中的level加上isSelected属性
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
    //取消筛选
    toggleRight1() {
        this.setData({
            showRight1: !this.data.showRight1
        })
    },
    // 楼栋筛选确定
    push(){
        this.data.showRight1 = !this.data.showRight1;
        var level1 = [] //区域id
        var level2 = [] //楼层id
        var level3 = [] //楼栋id
        let list1 = this.data.level1
        let list2 = this.data.level2
        let list3 = this.data.level3
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
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpace/simulatedOpen',
            header: {
                token: app.gettoken(),
                "Content-Type": "application/json"
            },
            data: {
                level1s: level1,
                level2s: level2,
                level3s: level3,
                projectId: this.data.projectId,
                onlySelling: this.data.onlySelling,
                pageSize:this.data.pageSize

            },
            success: res => {
                console.log(res.data.data);
                // this.data.showRight1=false;
                if (res.data.code == 0) {
                    this.setData({
                        parkList: res.data.data,
                        showRight1: false
                    });
                }else{
                    wx.showToast({
                        title: '筛选的车位不存在',
                        duration: 2000,
                        icon: 'none'
                    });
                    this.setData({
                        showRight1: false
                    });
                  
                }
            }
        })
    },
    // 跳转到真实开盘出价页面
    gobid(e) {
     if(e.currentTarget.dataset.status==1){
       wx.showToast({
         title: '该车位已出售',
         icon:'none'
       })
       return
     }
      var carid = e.currentTarget.dataset.id;
      console.log(carid);
        wx.navigateTo({
          url: '/pages/simulatedOpen/bid/bid?carid=' + carid+"&projectId="+this.data.projectId
        })
    },
    // 收藏跳转
    change1() {
        this.setData({
            active1: !this.data.active1,
            active2: !this.data.active2

        });
        wx.navigateTo({
          url: '/pages/simulatedOpen/collection/collection?projectId=' + this.data.projectId,
        })
    },
    // 选位大厅跳转
    change2() {
        this.setData({
            active2: !this.data.active2,
            active1: !this.data.active1
        });
        // wx.navigateTo({
        //     url: '/pages/opening/sellectionHall/sellectionHall',
        // })
    },
    renderData() {
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpace/simulatedOpen',
            header: {
                token: app.gettoken(),
                "content-type": 'application/json'
            },
            data: {
                'projectId': this.data.projectId,
                'pageSize':this.data.pageSize
                            },
            success: res => {
                console.log(res.data.data);
                // this.choose();
                this.setData({
                    parkList: res.data.data,
                })
            }
        })
    },
    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      let pageSize=this.data.pageSize
      pageSize+=40
      this.setData({
        pageSize
      })
      this.push()


    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //只看待售
    choose() {
        if (this.data.onlySelling == 0) {
            this.setData({
                onlySelling: 1
            })
        } else {
            this.setData({
                onlySelling: 0
            })
        }
        this.push()
     
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
    //头部时间数据
    renderTime() {
        var that = this;
        wx.request({
            method: 'post',
            url: app.url + '/project/auth0/miniProject/openDetail/' + that.data.projectId,
            header: {
                token: app.gettoken()
            },
            success: res => {
               //开盘时间
              var openStartTime = that.transformDate(res.data.data.mlStartTime);
                that.setData({
                    simulateopen:res.data.data,
                    startTime: openStartTime,
                    projectName: res.data.data.projectName
                });
            }
        })
    },
    //刷新
    fresh() {
        wx.showLoading({
            title: '数据加载中...',
            duration: 1000,
        });
        let clock = setTimeout(() => {
            wx.hideLoading();
            clearInterval(clock)
        }, 2000)
    } ,
  setstatus(){ //子组件倒计时结束调用修改状态  
    this.setData({
      setstatus:true
    })
  }  
 
})