const app = getApp()
Component({
  //组件属性
  properties: {
    picList: {
      type: 'JSON',
      value: []
    },
    // 判断是新增1还是修改2
    showType: {
      type: 'String',
      value: ''
    },
    info2: {
      type: 'JSON',
      value: ''
    }

  },
  data: {

  },
  methods: {
    upLoadPic() {
      var that = this;
      var picArr = []
      //新增
      wx.chooseImage({
        success: res => {
          var tempFilePaths = res.tempFilePaths
          var len = tempFilePaths.length;
          for (var i = 0; i < len; i++) {
            wx.uploadFile({
              url: app.url + '/project/auth0/image/upload',
              method: 'post',
              header: {
                token: app.gettoken()
              },
              filePath: tempFilePaths[i],
              name: 'file',
              success: res => {
                var data = res.data
                var pic = JSON.parse(data).data
                that.data.picList.push(pic)
                that.setData({
                  picList: that.data.picList
                })
                if (i == len) {
                  //调用父组件的set
                  that.triggerEvent('rentalUpload', that.data.picList)
                }
              }

            })

          }
        },
      })
    },
    // 删除图片
    delPic(e) {
      console.log(this.data.showType)
      let id = e.currentTarget.dataset.id
      var newPicList=this.data.picList
      newPicList.splice(id, 1)
      this.setData({
        picList: newPicList
      })
      console.log(this.data.picList)
      this.triggerEvent('rentalUpload', this.data.picList)
    }
  }
})