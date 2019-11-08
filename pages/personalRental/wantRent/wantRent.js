// pages/personalRental/wantRent/wantRent.js
const app = getApp()
var form={}
var getTag = require('../../../utils/getTag.js') //引入车位标签
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: true,
        tagNum: 0,
        selectedTags:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '想租车位',
        })
        this.setData({
            projectId: wx.getStorageSync('dataid')
        })
        // 获取置业顾问信息
        wx.request({
            url: app.url + '/project/auth0/miniProject/miniProjectInfo?projectId=' + this.data.projectId,
            method: 'post',
            header: {
                token: app.gettoken()
            },
            success: res => {
                console.log(res.data)
                if (res.data.code == 0) {
                    this.setData({
                        ProjectInfo: res.data.data
                    })
                }
            }
        })
        //获取所有的筛选条件
        getTag(wx.getStorageSync('dataid'), this)
        
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
     // 获取标题
     getTil(e) {
        console.log(e.detail.value)
        let title = e.detail.value
        form.title = title
        this.setData({
            form
        })
    },
    // 获取位置
    getLoc(e) {
        console.log(e.detail.value)
        let location = e.detail.value
        form.location = location
        this.setData({
            form
        })
    },
    getMinPrice(e) {
        console.log(e.detail.value)
        let minPrice = e.detail.value
        form.minPrice = minPrice
        this.setData({
            form
        })
    },
    getMaxPrice(e) {
        console.log(e.detail.value)
        let maxPrice = e.detail.value
        form.maxPrice = maxPrice
        this.setData({
            form
        })
    },
    getRemark(e) {
        console.log(e.detail.value)
        let remark = e.detail.value
        form.remark = remark
        this.setData({
            form
        })
    },
    getReleaserName(e) {
        console.log(e.detail.value)
        let releaserName = e.detail.value
        form.releaserName = releaserName
        this.setData({
            form
        })
    },
    getPhone(e) {
        console.log(e.detail.value)
        let releaserMobile = e.detail.value
        form.releaserMobile = releaserMobile
        this.setData({
            form
        })
    },
    // 添加标签
    showTags() {
        console.log(this.data.taglist)
        this.setData({
            showRight1: !this.data.showRight1,
        })
    },
    // 面议
    onChange() {
        console.log(this.data.checked)
        this.setData({
            checked: !this.data.checked
        })
    },
    // 发布信息
    releaseInfo() {
        form.truckSpaceTagArray = this.data.selectedTags
        form.projectId = this.data.projectId;
        // console.log(this.data.checked)
        // 发布类型 1: 求租 2: 求购
        form.releaseType = 1
        // 价格是否面议 0: 不是 1: 是
        form.priceOnFace = this.data.checked == true ? 1 : 0
        form.projectName = this.data.ProjectInfo.name
        console.log(form)
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/demand/insertOrUpdate',
            header: {
                token: app.gettoken(),
                'content-type': 'application/json'
            },
            data: JSON.stringify(form),
            success: res => {
                console.log(res.data)
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '添加成功',
                    })
                    let timer = setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/personalRental/rentalIndex/rentalIndex?num=3',
                        })
                        clearTimeout(timer)
                    }, 1000)
                } else {
                    wx.showToast({
                        title: res.data.msg,
                    })
                }
            }
        })
    },
    // 选择类别
    choseType(e) {
        console.log(e.currentTarget.dataset.num)
        let num = e.currentTarget.dataset.num;
        this.setData({
            tagNum: num
        })
    },
    //更多筛选
    morescreen(e) { 
        console.log(e)
        var tieleindex = e.currentTarget.dataset.tieleindex
        var index1 = e.currentTarget.dataset.index
        var item = this.data.taglist
        item[tieleindex].tagRespDtos[index1].isSelected = !item[tieleindex].tagRespDtos[index1].isSelected
        this.setData({
            taglist: item,
        })
    },
    // 删除
    delTag(e){
        var baseTags = this.data.selectedTags;
        console.log(baseTags)
        var i = e.currentTarget.dataset.index
        baseTags.splice(i,1)
        console.log(this.data.selectedTags)
        this.setData({
            selectedTags:baseTags
        })
    },
    // 取消
    cancle() {
        this.setData({
            showRight1: false
        })
    },
    // 确定
    corfim() {
        var chooseTags=[];
        console.log(this.data.taglist)
        this.data.taglist.map(item=>{
            item.tagRespDtos.map(item=>{
                console.log(item.isSelected)
                if (item.isSelected==true){
                    chooseTags.push(item.name)
                }
            })
        })
        console.log(chooseTags)
        this.setData({
            showRight1: false,
            selectedTags:chooseTags
        })
    }
})