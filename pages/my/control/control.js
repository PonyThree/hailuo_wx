// pages/my/control/control.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '核销码',
        });
        app.stopShare();
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
        // 获取可核销列表
        wx.request({
            url: app.url + '/order/auth0/orderFormVerifyList',
            method: 'get',
            header: {
                token: app.gettoken()
            },

            success: res => {
                if (res.data.code == 0) {
                    this.setData({
                        list: res.data.data
                    })
                }
            }

        })
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
    // 核销码立即使用
    flag(e) {
        console.log(e)
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/my/drop_code/drop_code?id=' + id,
        })
    },
    //查看核销码规则
    searchRel(e) {
        console.log(e)
        var projectId = e.currentTarget.dataset.pid;
        var type = e.currentTarget.dataset.ptype;
        wx.navigateTo({
            url: "/pages/writeOffRules/writeOffRules?pid=" + projectId + "&ptype=" + type,
        })
    }
})