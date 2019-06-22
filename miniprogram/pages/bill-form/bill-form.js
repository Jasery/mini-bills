// miniprogram/pages/bill-form/bill-form.js
import { createBill } from "../../api/index";

import { uploadFile } from '../../utils/index';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    money: 0,
    remark: '',
    members: [],
    participants: [],
    moneyError: false,
    files: []
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

    if (!this.isVaildMoney(this.data.money)) {
      wx.showToast({
        title: '请输入正确的金额',
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

    wx.showLoading();
    Promise.all(this.data.files.map(file => uploadFile(app.globalData.groupId, file)))
      .then(fileIds => {
        console.log('upload result')
        console.log(fileIds);
        billInfo.fileIds = fileIds;
        return createBill(billInfo);
      })
      .then(res => {
        wx.showToast({
          title: '账单创建成功',
          mask: true
        })
        wx.navigateBack({ delta: 1 })
      })
      .catch(err => {
        // TODO: 
        console.log('bill submit failed');
        console.log(err);
      })
  },
  onTitleChange(e) {
    this.data.title = e.detail.value;
  },

  onMoneyChange(e) {
    let value = e.detail.value;
    this.data.money = e.detail.value;
    let isVaildMoney = this.isVaildMoney(value);
    this.setData({
      moneyError: !isVaildMoney
    })
  },

  onRemarkChange(e) {
    this.data.remark = e.detail.value
  },

  isVaildMoney(money) {
    return /^\d{1,4}(\.\d{1,2})?$/.test(money);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onFileChange(e) {
    const { fileList } = e.detail
    this.setData({
      files: fileList.map(file => file.url)
    });
  },

  onPreview(e) {
    const { file, fileList } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  }
})