import { register } from '../../api/index';

// miniprogram/pages/authorization/authorizaion.js

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onGetUserInfo(res) {
        console.log('on get userINfo')
        console.log(res)
        if (res.detail && res.detail.userInfo) {
            wx.setStorageSync('userInfo', res.detail.userInfo);
            register(res.detail.userInfo)
                .then(res => {
                    wx.navigateBack({ delta: 1 })
                })
                .catch(err => {
                    console.log(err)
                    wx.showToast('注册失败')
                })
        }
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

    }
})