// pages/personalRental/saleReDetails/saleReDetails.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '求售发布详情',
        })
        let id = options.id
        this.setData({
            id: id
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
        this.getData(this.data.id)
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
    // 打电话
    call(e) {
        let phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone,
        })
    },
    getData(id) {
        wx.request({
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/demand/' + id,
            header: {
                token: app.gettoken()
            },
            success: res => {
                this.setData({
                    info: res.data.data
                })
            }
        })
    },
})