// pages/personalRental/rentCarEdit/rentCarEdit.js
const app = getApp()
var getTag = require('../../../utils/getTag.js') //引入车位标签
var form = {};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        option: false,
        showAddTag: false,
        typeList: [{
                id: '1',
                value: '月租'
            },
            {
                id: '2',
                value: '年租'
            },
        ],
        info: {
            typePrice: '请选择'
        },
        // 表单数据
        form: {},
        picList: [],
        selectedTags: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '出租车位',
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
    upLoadPic() {
        var that = this;
        console.log('上传图片')
        wx.chooseImage({
            success: function(res) {
                console.log(res)
                that.setData({
                    picList: res.tempFiles
                })
            },
        })
    },
    // 删除图片
    delPic(e) {
        let id = e.currentTarget.dataset.id
        console.log(id)
        let myPicList = this.data.picList
        myPicList.splice(id, 1)
        this.setData({
            picList: myPicList
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
    // onChange() {
    //     console.log(this.data.checked)
    //     this.setData({
    //         checked: !this.data.checked
    //     })
    // },
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
    // 获取编号
    getCode(e) {
        console.log(e.detail.value)
        let code = e.detail.value
        form.code = code
        this.setData({
            form
        })
    },
    // 获取车位面积
    getSize(e) {
        console.log(e.detail.value)
        let outsideArea = e.detail.value
        form.outsideArea = outsideArea
        this.setData({
            form
        })
    },
    // 获取售价
    getSellPrice(e) {
        console.log(e.detail.value)
        let sellPrice = e.detail.value
        form.sellPrice = sellPrice
        this.setData({
            form
        })
    },
    // 获取车位描述
    getDescription(e) {
        console.log(e.detail.value)
        let description = e.detail.value
        form.description = description
        this.setData({
            form
        })
    },
    // 联系人
    getreleaserName(e) {
        console.log(e.detail.value)
        let releaserName = e.detail.value
        form.releaserName = releaserName
        this.setData({
            form
        })
    },
    // 电话
    getPhone(e) {
        console.log(e.detail.value)
        let releaserMobile = e.detail.value
        form.releaserMobile = releaserMobile
        this.setData({
            form
        })
    },
    // 发布信息
    releaseInfo() {
        let images = [];
        this.data.picList.map(item => {
            images.push(item.path)
        })
        form.images = images
        // 出租1 出售2
        form.releaseType = 1
        form.truckSpaceTagArray = this.data.selectedTags
        form.projectId = this.data.projectId;
        console.log(this.data.ProjectInfo)
        form.projectName = this.data.ProjectInfo.name;
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/rentalSale/insertOrUpdate',
            header: {
                token: app.gettoken(),
                'content-type': 'application/json'
            },
            data: JSON.stringify(form),
            success: res => {
                console.log(res)
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '添加成功',
                    })
                    let timer = setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/personalRental/rentalIndex/rentalIndex?num=' + form.releaseType,
                        })
                        clearTimeout(timer)
                    }, 1000)
                }
            }
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
    // 删除标签
    delTag(e) {
        var baseTags = this.data.selectedTags;
        console.log(baseTags)
        var i = e.currentTarget.dataset.index
        baseTags.splice(i, 1)
        console.log(this.data.selectedTags)
        this.setData({
            selectedTags: baseTags
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
        var chooseTags = [];
        console.log(this.data.taglist)
        this.data.taglist.map(item => {
            item.tagRespDtos.map(item => {
                console.log(item.isSelected)
                if (item.isSelected == true) {
                    chooseTags.push(item.name)
                }
            })
        })
        console.log(chooseTags)
        this.setData({
            showRight1: false,
            selectedTags: chooseTags
        })
    },
    // 关闭标签弹窗
    onClose() {
        this.setData({
            showRight1: false
        })
    },
    // 租金选择下拉框
    bindShowThaw() {
        this.setData({
            option: !this.data.option
        })
    },
    // 租售方式
    myOpition(e) {
        console.log(e.currentTarget.dataset.name)
        this.setData({
            info: {
                typePrice: e.currentTarget.dataset.name == 1 ? '月租' : '年租'
            },
            option: false
        })
    },

})