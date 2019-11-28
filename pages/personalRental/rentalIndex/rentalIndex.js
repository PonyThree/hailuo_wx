// pages/personalRental/rentalIndex/rentalIndex.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num:1,
        btnum:0,
        show:false,
        info:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.num){
            this.setData({
                num:options.num||1
            })
        }
        wx.setNavigationBarTitle({
            title: '车位租售',
        })
        this.setData({
            projectId:wx.getStorageSync('dataid')
        })
        this.getData(this.data.num)
        
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getData(releaseType){
        if (releaseType == 1 || releaseType==2){
            wx.request({
                method: 'post',
                url: app.url + '/product/auth0/truckSpaceReleaseInfo/rentalSale/pageList',
                header: {
                    token: app.gettoken(),
                    "content-type": "application/json"
                },
                data: {
                    projectId: this.data.projectId,
                    current: 1,
                    pageSize: 100,
                    releaseType: releaseType
                },
                success: res => {
                    this.setData({
                        rentalInfo: res.data.data.records
                    })
                }
            })
        }
        if (releaseType == 3 || releaseType==4){
            wx.request({
                method: 'post',
                url: app.url + '/product/auth0/truckSpaceReleaseInfo/demand/pageList',
                header: {
                    token: app.gettoken(),
                    "content-type": "application/json"
                },
                data: {
                    projectId: this.data.projectId,
                    current: 1,
                    pageSize: 100,
                    releaseType: releaseType==3?1:2
                },
                success: res => {
                    this.setData({
                        rentalInfo: res.data.data.records
                    })
                }
            })
        }
        
    },
    // 切换数据
    handleTap(e){
        let num=e.currentTarget.dataset.num
        this.setData({
            num
        })
        this.getData(this.data.num)
    },
    // 打电话
    call(e){
        let phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone,
        })
    },
    handleClick(e){
        let num=e.currentTarget.dataset.num;
        console.log(num)
        this.setData({
            btnum:num
        })
        let mark=this.data.btnum
        if (mark==1){
            wx.switchTab({
                url: '/pages/firstPage/projectIndex/projectIndex',
            })
        }
        if (mark == 0) {
            wx.navigateTo({
                url: '/pages/personalRental/releaseIndex/releaseIndex',
            })
        }
        if (mark == 3) {
            console.log('去我的发布')
            wx.navigateTo({
                url: '/pages/personalRental/myRelease/myRelease',
            })
        }
    },
    // 租详情
    rentalDels(e){
        let id=e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/personalRental/rentalDetails/rentalDetails?id=' + id,
        })
    },
    // 售详情
    saleDels(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/personalRental/saleDetails/saleDetails?id='+id,
        })
    },
    // 求租详情
    rentRelease(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/personalRental/rentReDetails/rentReDetails?id='+id,
        })
    },
    // 求售发布详情
    saleReDels(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/personalRental/saleReDetails/saleReDetails?id='+id,
        })
    },
    onClose(){
        this.setData({
            show: false
        })
    },
    // 选择跳转出售页面
    jumpPage(e){
        let num=e.currentTarget.dataset.num
        if(num==1){
            wx.navigateTo({
                url: '/pages/personalRental/rentCarEdit/rentCarEdit',
            })
        }
        if (num == 2) {
            wx.navigateTo({
                url: '/pages/personalRental/wantRent/wantRent',
            })
        }
        if (num == 3) {
            wx.navigateTo({
                url: '/pages/personalRental/saleCarEdit/saleCarEdit',
            })
        }
        if (num == 4) {
            wx.navigateTo({
                url: '/pages/personalRental/wantBuy/wantBuy',
            })
        }
    }
})