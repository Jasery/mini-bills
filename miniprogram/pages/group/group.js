// miniprogram/pages/group/group.js

const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowCreate: false,
    groupMembers: [],
    isShowCreateForm: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  toCreateForm() {
    wx.navigateTo({
      url: '/pages/group-form/group-form',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('into group onshow')
    if (app.globalData.groupInfo) {
      console.log('groupInfo', app.globalData.groupInfo)
      console.log('members', app.globalData.members)
      this.setData({
        groupMembers: app.globalData.members,
        isShowCreate: false
      })
    } else {
      console.log('no gorup info')
      this.setData({
        isShowCreate: true
      });
    }
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