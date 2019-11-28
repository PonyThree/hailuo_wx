// pages/personalRental/releaseIndex/releaseIndex.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        btnum:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '发布信息',
        })
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
        this.setData({
            myHeight:wx.getSystemInfoSync().windowHeight
        })
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
    handleClick(e) {
        let num = e.currentTarget.dataset.num;
        this.setData({
            btnum: num
        })
        let mark = this.data.btnum
        if (mark == 1) {
            wx.switchTab({
                url: '/pages/firstPage/projectIndex/projectIndex',
            })
        }
        if (mark == 0) {
            wx.navigateBack({
                delta:1
            })
        }
        if (mark == 3) {
            console.log('去我的发布')
            wx.navigateTo({
                url: '/pages/personalRental/myRelease/myRelease',
            })
        }
    },
    // 选择跳转出售页面
    jumpPage(e) {
        let num = e.currentTarget.dataset.num
        if (num == 1) {
            wx.navigateTo({
                url: '/pages/personalRental/rentRelease/rentRelease',
            })
        }
        if (num == 2) {
            wx.navigateTo({
                url: '/pages/personalRental/wantRent/wantRent',
            })
        }
        if (num == 3) {
            wx.navigateTo({
                url: '/pages/personalRental/saleRelease/saleRelease',
            })
        }
        if (num == 4) {
            wx.navigateTo({
                url: '/pages/personalRental/wantBuy/wantBuy',
            })
        }
    }
})