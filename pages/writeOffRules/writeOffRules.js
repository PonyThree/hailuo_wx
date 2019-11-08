// pages/writeOffRules/writeOffRules.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectId:'',
        //判断是落位还是认购核销码
        rules:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var projectId=options.pid;
        var typeName;
        console.log(options);
        this.projectId = projectId;
        if (options.ptype==1){
            typeName='落位'
        }else{
            typeName = '认购'
        }
        wx.setNavigationBarTitle({
            title: `${typeName}核销码使用规则`,
        })
        app.stopShare();
        wx.request({
            method: 'post',
            url: app.url + '/project/auth0/project/selVerificationAgreement',
            header: {
                token: app.gettoken(),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                'projectId': projectId,
                "type": options.ptype
            },
            success:res=>{
                console.log(res.data)
                this.setData({
                    'rules':res.data.data
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