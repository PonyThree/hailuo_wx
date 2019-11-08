// pages/project/bulletin/bulletin.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0,
        buttletins:[],
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '项目动态',
        })
        this.renderData();
    },
    //项目公告信息
    renderData(){
        let projectId = wx.getStorageSync('dataid')
        wx.request({
            method:'post',
            header: {
                token: app.gettoken(),
                "content-type":'application/x-www-form-urlencoded'
            },
            data:{
                projectId
            },
            url: app.url +'/project/auth0/notice/miniFindList',
            success:res=>{
                console.log(res.data.data)
                this.setData({
                    projectBulletin: res.data.data
                })
            }
        })
    },
    //查看图片
    goView(e){
        // console.log(e)
        let url = e.currentTarget.dataset.url
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: url // 需要预览的图片http链接列表
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