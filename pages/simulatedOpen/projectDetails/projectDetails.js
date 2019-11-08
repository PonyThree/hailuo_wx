// pages/opening/projectDetails/projectDetails.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectId: '',
        //项目banner
        bannerVos: [],
        //项目名称
        name: '',
        //小区详情信息
        districtVo: [],
        //车位图
        truckSpaceImages: '',
        //车位描述
        description: '',
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            projectId: '3655925066186620928',
        })
        this.getDetailsData();
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
    //   项目详情数据加载
    getDetailsData() {
        var that = this;
        wx.request({
            method: 'post',
            url: app.url + '/project/auth0/miniProject/projectDetail/' + that.data.projectId,
            header: {
                token: app.gettoken(),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: res => {
                console.log(res.data.data);
                that.setData({
                    bannerVos: res.data.data.bannerVos,
                    name: res.data.data.name,
                    districtVo: res.data.data.districtVo,
                    truckSpaceImages: res.data.data.truckSpaceImages,
                    description: res.data.data.description,
                })
                console.log(this.data);
            }

        })
    },
    // 跳转到用户协议
    gosellectionHall() {
        wx.navigateTo({
            url: '/pages/simulatedOpen/sellectionHall/sellectionHall',
        })
    },
})