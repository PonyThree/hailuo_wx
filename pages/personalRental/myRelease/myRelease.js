// pages/personalRental/myRelease/myRelease.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actions: [{
            name: '删除',
            color: '#ffffff',
            fontsize: '20',
            width: 100,
            height: 324,
            // icon: 'like',
            background: 'red'
        }, ],
        myReleaseInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '我的发布',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            projectId: wx.getStorageSync('dataid')
        })
        this.getData()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    getData(){
        let oneRentInfo=[]
        let oneBuyInfo=[]
        let twoRentInfo=[]
        let twoSaleInfo=[]
        let rentalSaleInfos=[]
        let demandInfos=[]
        var obj={}
        // 获取所有数据
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/byUser/' + this.data.projectId,
            header: {
                token: app.gettoken(),
            },
            success: res => {
                console.log(res.data.data)
                var data = res.data.data
                data.demandInfos.records.map(item=>{
                    console.log(item.releaseType)
                    // 乙方 demandInfos
                    if (item.releaseType == 1) {
                        // 想租
                        oneRentInfo.push(item)
                    }
                    if(item.releaseType==2){
                        // 想买
                        oneBuyInfo.push(item)
                    }
                    
                })
                // 处理数据将租售数据分类组合在一起
                // 甲方 rentalSaleInfos
                data.rentalSaleInfos.records.map(item=>{
                    // 出租
                    if(item.releaseType==1){
                        twoRentInfo.push(item)
                    }
                    // 出租
                    if (item.releaseType == 2) {
                        twoSaleInfo.push(item)
                    }
                })
                demandInfos=oneRentInfo.concat(oneBuyInfo)
                rentalSaleInfos=twoRentInfo.concat(twoSaleInfo)
                obj.demandInfos = demandInfos
                obj.rentalSaleInfos = rentalSaleInfos
                // console.log(obj)
                this.setData({
                    myReleaseInfo: obj
                })
            }
        })
    },
    changeRent(e) {
        console.log(e)
    },
    // 需求方删除
    changeRent(e){
        let id = e.currentTarget.dataset.id
        console.log(`点了需求方${id}删除`)
        wx.request({
            method:'post',
            url: app.url +'/product/auth0/truckSpaceReleaseInfo/demand/delete',
            header:{
                token:app.gettoken(),
                "content-type":'application/json'
            },
            data:id,
            success:res=>{
                if(res.data.code==0){
                    wx.showToast({
                        title: '删除成功',
                    })
                    this.getData()
                }else{
                    wx.showToast({
                        title: res.data.msg,
                    })
                }
            }

        })
    },
    // 租售方删除
    changeSale(e) {
        let id=e.currentTarget.dataset.id
        console.log(`点了租售方${id}删除`)
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/rentalSale/delete',
            header: {
                token: app.gettoken(),
                "content-type": 'application/json'
            },
            data: id,
            success: res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '删除成功',
                    })
                    this.getData()
                } else {
                    wx.showToast({
                        title: res.data.msg,
                    })
                }
            }

        })
    },
    // 求租详情
    wantRentDetail(e) {
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type
        console.log(id)
        console.log(type)
        if(id){
            // 求租
            if(type==1){
                wx.navigateTo({
                    url: '/pages/personalRental/wtRentEdit/wtRentEdit?id=' + id,
                })
            }
            // 求售
            if (type == 2) {
                wx.navigateTo({
                    url: '/pages/personalRental/wtSaleEdit/wtSaleEdit?id=' + id,
                })
            }
            
        }
        
    },
    // 出售
    goSaleDetail(e){
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type
        console.log(id)
        console.log(type)
        if (id) {
            if (type == 1) {
                wx.navigateTo({
                    url: '/pages/personalRental/rentCarEdit/rentCarEdit?id=' + id,
                })
            }
            if (type == 2) {
                wx.navigateTo({
                    url: '/pages/personalRental/saleCarEdit/saleCarEdit?id=' + id,
                })
            }

        }
    }
})