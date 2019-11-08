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
        // typeList: [{
        //         id: '1',
        //         value: '月租'
        //     },
        //     {
        //         id: '2',
        //         value: '年租'
        //     },
        // ],
        // info2: {
        //     typePrice: '请选择'
        // },
        // 表单数据
        form: {},
        // picList: [],
        // selectedTags: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id
        // console.log(id)
        this.setData({
            projectId: wx.getStorageSync('dataid')
        })
        this.setData({
            id: id
        })
        wx.setNavigationBarTitle({
            title: '出租车位',
        })
        //获取所有的筛选条件
        getTag(wx.getStorageSync('dataid'), this)

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
        this.getData()

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
    // 甲方查询修改之前的数据
    getData() {
        wx.request({
            method: 'get',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/rentalSale/' + this.data.id,
            header: {
                token: app.gettoken()
            },
            success: res => {
                console.log(res.data)
                form = res.data.data
                this.setData({
                    info: res.data.data,
                    // 标签
                    info1: res.data.data,
                    // 图片
                    info2: res.data.data,
                    checked: res.data.data.priceOnFace == 1 ? 'true' : 'false'
                })
            }
        })
    },
    upLoadPic() {
        var that = this;
        let oldPicList=this.data.info2.images
        console.log('上传图片')
        wx.chooseImage({
            success: function (res) {
                // console.log(res)
                let newPicList = oldPicList.concat(res.tempFiles)
                // console.log(newPicList)
                that.setData({
                    info2:{
                        images:newPicList
                    }
                })
            },
        })
    },
    // 删除图片
    delPic(e) {
        let id = e.currentTarget.dataset.id
        console.log(id)
        let myPicList = this.data.info2.images
        myPicList.splice(id, 1)
        this.setData({
            info2:{
                images:myPicList
            }
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
        form.images = this.data.info2.images
        console.log(this.data.info2.images)
        // 出租1 出售2
        form.releaseType = 1
        form.truckSpaceTagArray = this.data.info1.truckSpaceTagArray
        form.projectId = this.data.projectId
        form.projectName = this.data.info.projectName
        form.id=this.data.info.id
        console.log(form)
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
                        title: '修改成功',
                    })
                    let timer = setTimeout(() => {
                        // wx.navigateTo({
                        //     url: '/pages/personalRental/rentalIndex/rentalIndex?num=' + form.releaseType,
                        // })
                        wx.navigateTo({
                            url: '/pages/personalRental/myRelease/myRelease',
                        })
                        clearTimeout(timer)
                    }, 1000)
                }else {
                    wx.showToast({
                        title: res.data.msg,
                    })
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
    // 删除
    delTag(e) {
        var baseTags = this.data.info1.truckSpaceTagArray;
        console.log(baseTags)
        var i = e.currentTarget.dataset.index
        baseTags.splice(i, 1)
        console.log(this.data.info1.truckSpaceTagArray)
        this.setData({
            info1: {
                truckSpaceTagArray: baseTags
            }
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
        this.data.taglist.map(item => {
            item.tagRespDtos.map(item => {
                console.log(item.isSelected)
                if (item.isSelected == true) {
                    chooseTags.push(item.name)
                }
            })
        })
        let oldTag = this.data.info1.truckSpaceTagArray
        console.log(chooseTags)
        console.log(oldTag)
        var newTag = Array.from(new Set(oldTag.concat(chooseTags)))
        console.log(newTag)
        this.setData({
            showRight1: false,
            info1: {
                truckSpaceTagArray: newTag
            }
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