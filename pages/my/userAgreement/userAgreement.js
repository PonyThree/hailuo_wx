// pages/my/userAgreement/userAgreement.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        agreement:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '用户协议',
        })
        this.renderAgreement();
    },
    renderAgreement(){
        var that=this;
        wx.request({
            url: app.url +'/platform/auth0/agreementTab/selInfo',
            method:'post',
            header: {
                'token': app.gettoken(),
                'content-type': 'application/x-www-form-urlencoded'
            },
            success:res=>{
                console.log(res.data.data.agreementBody)
                that.setData({
                    agreement: res.data.data.agreementBody
                })
            }
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

    }
})