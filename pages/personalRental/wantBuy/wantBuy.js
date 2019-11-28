// pages/personalRental/wantBuy/wantBuy.js
const app = getApp()
var getTag = require('../../../utils/getTag.js') //引入车位标签
var form={}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: true,
        tagNum: 0,
        show:true,
        selectedTags: []
    },         

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '想买车位',
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
    // 获取标题
    getTil(e) {
        let title = e.detail.value
        form.title = title
        this.setData({
            form
        })
    },
    // 获取位置
    getLoc(e) {
        let location = e.detail.value
        form.location = location
        this.setData({
            form
        })
    },
    getMinPrice(e) {
        let minPrice = e.detail.value
        form.minPrice = minPrice
        this.setData({
            form
        })
    },
    getMaxPrice(e) {
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
        let releaserName = e.detail.value
        form.releaserName = releaserName
        this.setData({
            form
        })
    },
    getPhone(e) {
        let releaserMobile = e.detail.value
        form.releaserMobile = releaserMobile
        this.setData({
            form
        })
    },
    // 添加标签
    showTags() {
        this.setData({
            showRight1: !this.data.showRight1,
            show:false,
        })
    },
    // 面议
    onChange() {
        this.setData({
            checked: !this.data.checked
        })
    },
    // 发布信息
    releaseInfo() {
        form.truckSpaceTagArray = this.data.selectedTags
        form.projectId = this.data.projectId;
        // 发布类型 1: 求租 2: 求购
        form.releaseType = 2
        // 价格是否面议 0: 不是 1: 是
        form.priceOnFace = this.data.checked == true ? 1 : 0
        form.projectName = this.data.ProjectInfo.name
      if (!form.title) {
        wx.showToast({
          title: '请先填写标题',
        })
        return;
      }
      if (!form.location) {
        wx.showToast({
          title: '请填写位置',
        })
        return;
      }
      if (form.priceOnFace==0&&(!form.minPrice)) {
        wx.showToast({
          title: '请填写售价范围',
        })
        return;
      }
      if (form.priceOnFace == 0 &&(!form.maxPrice)) {
        wx.showToast({
          title: '请填写售价范围',
        })
        return;
      }
      if (form.priceOnFace == 0 &&(form.maxPrice <= form.minPrice)) {
        form.maxPrice = ''
        wx.showToast({
          title: '请重新输入价格',
        })
        return;
      }
      if (form.truckSpaceTagArray.length <= 0) {
        wx.showToast({
          title: '请选择标签',
        })
        return;
      }
      if (!form.remark) {
        wx.showToast({
          title: '请填写备注'
        })
        return;
      }
      if (!form.releaserName) {
        wx.showToast({
          title: '请填写联系人'
        })
        return;
      }
      if (!form.releaserMobile) {
        wx.showToast({
          title: '请填写电话号码'
        })
        return;
      }
        wx.request({
            method: 'post',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/demand/insertOrUpdate',
            header: {
                token: app.gettoken(),
                'content-type': 'application/json'
            },
            data: JSON.stringify(form),
            success: res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '添加成功',
                    })
                    let timer = setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/personalRental/rentalIndex/rentalIndex?num=4',
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
        let num = e.currentTarget.dataset.num;
        this.setData({
            tagNum: num
        })
    },
    //更多筛选
    morescreen(e) {
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
        var baseTags = this.data.selectedTags;
        var i = e.currentTarget.dataset.index
        baseTags.splice(i, 1)
        this.setData({
            selectedTags: baseTags
        })
    },
    // 取消
    cancle() {
        this.setData({
            showRight1: false,
            show:true,
        })
    },
    // 确定
    corfim() {
        var chooseTags = [];
        this.data.taglist.map(item => {
            item.tagRespDtos.map(item => {
                if (item.isSelected == true) {
                    chooseTags.push(item.name)
                }
            })
        })
        this.setData({
            showRight1: false,
            selectedTags: chooseTags,
            show:true,
        })
    }
})