// pages/personalRental/rentCarEdit/rentCarEdit.js
const app = getApp()
var getTag = require('../../../utils/getTag.js') //引入车位标签
var form = {};
var oldPicList=[];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        option: false,
        showRight1: false,
        show:true,
        showType: '2',  
        typeList: [{
                id: '产权车位',
                value: '产权车位'
            },
            {
                id: '人防车位',
                value: '人防车位'
            },
            {
                id: '非产权车位',
                value: '非产权车位'
            }
        ],
        info: {
            truckSpaceProperty: '请选择'
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       
        let id = options.id
        this.setData({
            projectId: wx.getStorageSync('dataid')
        })
        this.setData({
            id: id
        })
        wx.setNavigationBarTitle({
            title: '出售车位',
        })
        //获取所有的筛选条件
        getTag(wx.getStorageSync('dataid'), this)
        this.getData()
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
        // this.getData()
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
    // 乙方查询修改之前的数据
    getData() {
        wx.request({
            method: 'get',
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/rentalSaleNoCache/' + this.data.id,
            header: {
                token: app.gettoken()
            },
            success: res => {
                console.log(res.data)
                form = res.data.data
                oldPicList=res.data.data.images
                this.setData({
                    showFirst:1,
                    // 基本信息
                    info: res.data.data,
                    // 标签
                    info1: res.data.data,
                    // 图片
                    info2: res.data.data,
                    // 车位性质
                    info3: res.data.data,
                })
            }
        })
    },
    // upLoadPic() {
    //     var that = this;
    //   wx.chooseImage({
    //     success: res => {
    //       var tempFilePaths = res.tempFilePaths
    //       let oldPicList = this.data.info2.images
    //       var len = tempFilePaths.length;
    //       for (var i = 0; i < len; i++) {
    //         wx.uploadFile({
    //           url: app.url + '/project/auth0/image/upload',
    //           method: 'post',
    //           header: {
    //             token: app.gettoken()
    //           },
    //           filePath: tempFilePaths[i],
    //           name: 'file',
    //           success: res => {
    //             var data = res.data
    //             var pic = JSON.parse(data).data
    //             oldPicList.push(pic)
    //             that.setData({
    //               [`info2.images`]: oldPicList
    //             })

    //           }
    //         })
    //       }
    //     },
    //   })
        // wx.chooseImage({
        //     success: function (res) {
        //         let newPicList = oldPicList.concat(res.tempFilePaths)
        //         that.setData({
        //            [`info2.images`]:newPicList
        //         })
        //     },
        // })
    // },
    // 删除图片
    // delPic(e) {
    //     let id = e.currentTarget.dataset.id
    //     console.log(id)
    //         var  myPicList = this.data.info2.images
    //         myPicList.splice(id, 1)
    //         wx.showToast({
    //             title: '删除成功',
    //         })
    //         this.setData({
    //             info2:{
    //                 images:myPicList
    //             }
    //         })
    // },
  // 接收子组件传递的参数
  rentalUpload(e) {
    let images = e.detail
    form.images = images
    this.setData({
      form
    })
  },
    // 添加标签
    showTags() {
        console.log(this.data.taglist)
        this.setData({
            showRight1: !this.data.showRight1,
            show:false,
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
    // 获取编号
    getCode(e) {
        let code = e.detail.value
        form.code = code
        this.setData({
            form
        })
    },
    // 获取车位面积
    getSize(e) {
        let outsideArea = e.detail.value
        form.outsideArea = outsideArea
        this.setData({
            form
        })
    },
    // 获取售价
    getSellPrice(e) {
        let sellPrice = e.detail.value
        form.sellPrice = sellPrice
        this.setData({
            form
        })
    },
    // 获取车位描述
    bindTextAreaBlur(e) {
        let description = e.detail.value
        form.description = description
        this.setData({
            form
        })
    },
    // 联系人
    getreleaserName(e) {
        let releaserName = e.detail.value
        form.releaserName = releaserName
        this.setData({
            form
        })
    },
    // 电话
    getPhone(e) {
        let releaserMobile = e.detail.value
        form.releaserMobile = releaserMobile
        this.setData({
            form
        })
    },
    // 发布信息
    releaseInfo() {
        form.images = this.data.info2.images
        // 出租1 出售2
        form.releaseType = 2
        form.projectId = this.data.projectId
        form.truckSpaceTagArray=this.data.info1.truckSpaceTagArray
        form.projectName = this.data.info.projectName
        form.id=this.data.info.id
        form.truckSpaceProperty=this.data.info3.truckSpaceProperty
      if (form.images.length <= 0) {
        wx.showToast({
          title: '请先上传图片',
        })
        return;
      }
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
      if (!form.code) {
        wx.showToast({
          title: '请填写编号',
        })
        return;
      }

      if (!form.outsideArea) {
        wx.showToast({
          title: '请填写大小',
        })
        return;
      }
      if (form.truckSpaceProperty == '请选择') {
        wx.showToast({
          title: '请选择车位属性',
        })
        return;
      }
      if (!form.sellPrice) {
        wx.showToast({
          title: '请填写租金',
        })
        return;
      }
      if (form.truckSpaceTagArray.length <= 0) {
        wx.showToast({
          title: '请选择标签',
        })
        return;
      }
      if (!form.description) {
        wx.showToast({
          title: '请填写描述'
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
            url: app.url + '/product/auth0/truckSpaceReleaseInfo/rentalSale/insertOrUpdate',
            header: {
                token: app.gettoken(),
                'content-type': 'application/json'
            },
            data: JSON.stringify(form),
            success: res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '修改成功',
                    })
                    let timer = setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
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
        var baseTags = this.data.info1.truckSpaceTagArray;
        var i = e.currentTarget.dataset.index
        baseTags.splice(i, 1)
        this.setData({
            info1: {
                truckSpaceTagArray: baseTags
            }
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
        let oldTag = this.data.info1.truckSpaceTagArray
        var newTag = Array.from(new Set(oldTag.concat(chooseTags)))
        this.setData({
            showRight1: false,
            show:true,
            info1: {
                truckSpaceTagArray: newTag
            }
        })
    },
    // 关闭标签弹窗
    onClose() {
        this.setData({
            showRight1: false,
            show:true,
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
        let name = e.currentTarget.dataset.name
        this.setData({
            info3: {
                truckSpaceProperty: name
            },
            option: false
        })
    }
})