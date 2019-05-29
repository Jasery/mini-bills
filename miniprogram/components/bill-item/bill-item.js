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
  }
})
