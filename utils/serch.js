const app = getApp()
module.exports=function searhlist(data, serch,_this) {  //接受三个参数,筛选内容,是否为下拉刷新,和this
  wx.request({
    url: app.url + '/product/auth0/truckSpace/conditionSearch',
    method: 'post',
    header: {
      token: app.gettoken()
    },
    data: data,
    success: res => {
      wx.hideLoading()
      if (res.data.code == 0) {
        if (serch) {
          _this.setData({
            carlist: res.data.data,
            showRight1: false,
            showloding: false,
            tip: false
          })
          return
        }
        //这堆代码别动,出了事自己负责
        let oldTruckSpaces = _this.data.carlist.truckSpaces[_this.data.carlist.truckSpaces.length - 1]
        let odlcode = oldTruckSpaces.level1Code + oldTruckSpaces.level2Code + oldTruckSpaces.level3Code //获取老数组的code
        //新code
        let newTruckSpaces = res.data.data.truckSpaces[0]
        let newCode = newTruckSpaces.level1Code + newTruckSpaces.level2Code + newTruckSpaces.level3Code
        let tcarList = _this.data.carlist
        if (odlcode == newCode) {
          let newcarlist = (oldTruckSpaces.nodeRespDtos.concat(res.data.data.truckSpaces[0].nodeRespDtos))
          _this.setData({
            [`carlist.truckSpaces[${tcarList.truckSpaces.length - 1}].nodeRespDtos`]: newcarlist,
            [`carlist.hasData`]: res.data.data.hasData,
            showRight1: false,
            showloding: false,
            tip: false
          })
          
        } else {
    
          let oldtruckSpaces = _this.data.carlist.truckSpaces
          _this.setData({
            [`carlist.truckSpaces[${tcarList.truckSpaces.length}]`]: newTruckSpaces,
            [`carlist.hasData`]: res.data.data.hasData,
            showRight1: false,
            showloding: false,
            tip: false
          })
        }

      }
    }
  })
}