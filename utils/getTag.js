const app = getApp()
module.exports = function getTag(projectId, _this) { //获取车位楼栋标签

  // 获取所有的筛选条件
  //一级区域
  wx.request({
    url: app.url + '/product/auth0/truckSpaceArea/selectMiniAllList',
    header: {
      token: app.gettoken()
    },
    data: {
      projectId
    },
    success: res => {

      if (res.data.code == 0) {
        _this.setData({
          level1: res.data.data
        })
      }
    }
  })
  //二级区域
  wx.request({
    url: app.url + '/product/auth0/TruckSpaceLevelThree/doMiniSelectAllList',
    header: {
      token: app.gettoken()
    },
    data: {
      projectId
    },
    success: res => {
      if (res.data.code == 0) {
        _this.setData({
          level2: res.data.data
        })
      }
    }
  })
  //三级区域
  wx.request({
    url: app.url + '/product/auth0/TruckSpaceLevelTwo/doSelectMiniAllList',
    header: {
      token: app.gettoken()
    },
    data: {
      projectId
    },
    success: res => {
      if (res.data.code == 0) {
        _this.setData({
          level3: res.data.data
        })
      }
    }
  })
  // 标签类别
  wx.request({
    url: app.url + '/product/auth0/tagType/miniAllList',
    header: {
      token: app.gettoken()
    },
    data: {
      projectId
    },
    success: res => {
      if (res.data.code == 0) {
        _this.setData({
          taglist: res.data.data,
        })

      }
    }
  })
}