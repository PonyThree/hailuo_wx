// pages/project/selection/selection.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    
    this.setData({
      projectId: e.projectId || '3702765637613912064'
    })

    wx.request({ //获取区域
      url: app.url + '/product/auth0/projectArea/levelInfo/' + this.data.projectId,
      method: 'post',
      header: {
        token: app.gettoken()
      },
      success: res => {
        if (res.data.code == 0) {
          let levelOneAndThree = res.data.data.levelOneAndThree
          console.log(levelOneAndThree)
            if (levelOneAndThree.length>0){
                levelOneAndThree[0].isSelected = true
            }
          this.setData({
            levelOneAndThree: levelOneAndThree,
            levelThree: res.data.data.levelThree,
            levelTwo: res.data.data.levelTwo
          })
            if (levelOneAndThree.length > 0) {
                //默认获取第一个区层栋
                let id = levelOneAndThree[0].id
                id = id.split(',')
                let levelId = id[0]
                let levelThreeId = id[1]
                this.getBylevel(levelId, levelThreeId, this.data.projectId)
            }
          
        }
      }
    })




  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  searchTop(e) { //头部筛选
    let id = e.currentTarget.id
    var index = e.currentTarget.dataset.index;
    var item = this.data.levelOneAndThree[index];
    let levelOneAndThree = this.data.levelOneAndThree
    levelOneAndThree.map(_item => {
      if (_item.id == id) {
        _item.isSelected = true
        let id = item.id
        id = id.split(',')
        let levelId = id[0]
        let levelThreeId = id[1]
        this.getBylevel(levelId, levelThreeId, this.data.projectId)
      } else {
        _item.isSelected = false
      }
    })
    this.setData({
      levelOneAndThree,
    })

  },
  rightActive(e) { //右侧楼栋筛选
    let id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index;
    var item = this.data.levelTwo[index];
    item.isSelected = !item.isSelected;
    this.setData({
      levelTwo: this.data.levelTwo
    })
    let rightID = []
    let topId = []
    var rightList1 = this.data.levelTwo
    let levelOneAndThree1 = this.data.levelOneAndThree
    rightList1.map((value, index) => { //获取楼栋ID
      if (value.isSelected) {
        rightID.push(value.id)
      }
      this.setData({
        rightID: rightID
      })
    })
    levelOneAndThree1.map((value, index) => {
      if (value.isSelected) {
        topId.push(value.id)
      }

    })
    this.setData({
      topId
    })
    this.getAbleSellCount() //
  },
  goParkinglist(e) {
    if (this.data.rightID.length == 0) {
      wx.showToast({
        title: '请选择楼栋',
        icon: 'none'
      })
      return
    }
    let searchcriteria = {
      "projectId": this.data.projectId,
      "level1": [this.data.level1],
      "level2": this.data.rightID,
      "level3": [this.data.level3], 
    }
    
    wx.setStorageSync('searchcriteria', searchcriteria)
    this.insertOrUpdate()
    wx.navigateTo({
      url: '/pages/project/Parkinglist2/Parkinglist2?projectId='+this.data.projectId,
    })


  },
  getBylevel(levelId, levelThreeId, projectId) { //获取区域图片
    wx.request({
      url: app.url + '/product/auth0/truckSpaceLayoutImage/getByLevel',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        levelId,
        levelThreeId,
        projectId

      },
      success: res => {
        if (res.data.code == 0) {
          let levelTwo = this.data.levelTwo
          levelTwo.map(item => {
            item.isSelected = false
          })
          this.setData({
            imageDetail: res.data.data,
            levelTwo,
            rightID: []
          })
        }
      }
    })

  },
  getAbleSellCount() { //获取项目可销售数量
    let topId = this.data.topId
    topId = topId.join(',')
    topId = topId.split(',')
    this.setData({
      level1: topId[0],
      level3: topId[1]

    })
    wx.request({
      url: app.url + '/product/auth0/truckSpace/getAbleSellCount',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        level1: this.data.level1,
        level3: this.data.level3,
        level2Array: this.data.rightID,
        projectId: this.data.projectId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            count: `(${res.data.data}可选车位)`
          })
        }
      }
    })

  },
  insertOrUpdate(){  //添加用户区层栋缓存到服务端
    wx.request({
      url: app.url + '/user/auth0/userProjectSelected/insertOrUpdate',
      method: 'post',
      header: {
        token: app.gettoken()
      },
      data: {
        levelId: this.data.level1,
        levelThreeId: this.data.level3,
        levelTwoIdArray: this.data.rightID,
        projectId: this.data.projectId
      },
      success: res => {
        console.log(res)
        if (res.data.code == 0) {
        }
      }
    })

  }

})