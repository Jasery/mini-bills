// miniprogram/pages/group-form/group-form.js
import { createGroup, login } from "../../api/index";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    intro: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  submit(e) {
    console.log('on submit')
    console.log('name', this.data.name);
    console.log('intro', this.data.intro)
    wx.showLoading();
    createGroup(app.globalData.userId, this.data.name, this.data.intro)
      .then(res => {
        console.log('create group success....', res)
        app.loginPromise = login(app.globalData.openId)
          .then(res => {
            console.log('login success')
            console.log(res)
            app.globalData.userInfo = res.userInfo
            app.globalData.isAdmin = res.isAdmin
            app.globalData.messages = res.messages
            app.globalData.groupInfo = res.groupInfo
            app.globalData.members = res.members
            app.globalData.userId = res._id
            wx.navigateBack({ delta: 1 })
            console.log('app', app)
          })
      })
  },
  onNameInput(event) {
    console.log('on Name Input....', event)
    this.data.name = event.detail.value;
  },

  onIntroInput(event) {
    console.log('on intro input....', event)
    this.data.intro = event.detail.value;
  }
})