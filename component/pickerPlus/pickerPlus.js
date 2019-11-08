// component/pickerPlus/pickerPlus.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pickerData: {
      type: "Array",
      value: [
        ["默认"],
        ["默认"],
        ["默认"]
      ]
    },
    title: {
      type: "String",
      value: "请传入title字段"
    },
    type: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectData: null, //选中的值
    bottom: -400
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // 设置选中值的初始值 默认设置第一项
      this.setDetailPrice();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 动画
     */
    showAnimation: function () {
      this.setData({
        bottom: 0
      })
    },
    hiddenAnimation: function (_this, options) {
      // console.log(_this, options);

      this.setData({
        bottom: -400
      }, () => {
        setTimeout(() => {
          _this.setData(options)
        }, 300);
      })
    },
    /**
     * 设置默认值
     */
    setDetailPrice: function () {
      let selectData = [];
      if (!this.data.pickerData || this.data.pickerData.length == 0) {
        return false;
      }
      this.data.pickerData.forEach(item => {
        selectData.push(item[0])
      })
      // console.log(selectData);

      this.setData({
        selectData
      })
    },
    // 取消
    cancel: function () {
      let {
        type
      } = this.data;
      this.triggerEvent("prick", {
        ComponentBool: true,
        selectData: null,
        type
      })
    },
    // 确认
    affirm: function () {
      let {
        selectData,
        type
      } = this.data;
      this.triggerEvent("prick", {
        ComponentBool: true,
        selectData,
        type
      })
    },
    // 选择数据
    pickerChange: function (e) {
      // console.log(e.detail.value);
      let indexArr = e.detail.value;
      let pickerData = this.data.pickerData;
      let selectData = []
      indexArr.forEach((item, index) => {
        selectData.push(pickerData[index][item])
      })
      this.setData({
        selectData
      })
    }
  }
})