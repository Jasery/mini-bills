// components/bill-item/bill-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bill: Object
  },
  /**
   * 组件的初始数据
   */
  data: {
    time: 0
  },
  lifetimes: {
    attached() {
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    onViewAccessory() {
      wx.showLoading({
        title: '附件加载中'
      });
      Promise.all(this.data.bill.fileIds.map(fileID => wx.cloud.downloadFile({fileID})))
        .then(res => {
          wx.hideLoading();
          let tempFilePaths = res.map(item => item.tempFilePath);
          wx.previewImage({
            current: tempFilePaths[0],
            urls: tempFilePaths,
          })
        })
        .catch(err => {
          
        })
    }
  }
})
