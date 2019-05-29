// miniprogram/pages/bill-form/bill-form.js
import { createBill } from "../../api/index";
const app = getApp();
import { $wuxToast } from '../../components/wux/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    money: 0,
    remark: '',
    members: [],
    participants: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      members: app.globalData.members
    })
  },

  onParticipantClick(e) {
    console.log('on participant click')
    console.log(e)
    let index = e.target.dataset.index
    this.data.members[index].isSelected = !this.data.members[index].isSelected;
    this.setData({
      members: this.data.members
    })
  },

  submit(e) {
    console.log('on form submit')
    if (!this.data.title) {
      wx.showToast({
        title: '请输入账单项目',
        icon: 'loading'
      })
      return
    }
    if (!this.data.money) {
      wx.showToast({
        title: '请输入金额',
        icon: 'loading'
      })
      return
    }

    let participants = this.data.members
      .filter(item => item.isSelected)
      .map(item => item._openid)
    if (!participants.length) {
      wx.showToast({
        title: '请选择平摊成员',
        icon: 'loading'
      })
      return
    }

    let billInfo = {
      title: this.data.title,
      money: Number(this.data.money),
      remark: this.data.remark,
      time: new Date(),
      groupId: app.globalData.groupId,
      participants: participants
    }
    console.log('bill info', billInfo)
    createBill(billInfo)
      .then(res => {
        wx.showToast({
          title: '账单创建成功',
          mask: true
        })
        wx.navigateBack({ delta: 1 })
      })
  },
  onTitleChange(e) {
    console.log('on title change', e.detail.value)
    this.data.title = e.detail.value;
  },

  onMoneyChange(e) {
    console.log('on money change', e.detail.value)
    this.data.money = e.detail.value
  },

  onRemarkChange(e) {
    console.log('on remark change', e.detail.value)
    this.data.remark = e.detail.value
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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