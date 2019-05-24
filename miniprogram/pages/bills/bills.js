import { getBills } from "../../api/index";
// miniprogram/pages/bills/bills.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        billList: [],
        isShowGroupTips: false
    },

    query: null,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
        
        this.query = options;
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        let that = this;
        app.globalData.loginPromise
            .then(res => {
                console.log('bills page after login')
                if (app.globalData.groupInfo) {
                    that.refreshBills();
                } else {
                    // TODO: 显示未加入群组
                    console.log('never join group')
                    this.setData({
                        isShowGroupTips: true
                    })
                    if (this.query.joinGroupId) {
                                
                        wx.navigateTo({
                            url: '/pages/join-group/join-group',
                        })
                    }
                }
            })
    },

    showLoading() {
        wx.showLoading({
            title: '数据加载中...',
            mask: true
        })
    },

    hideLoading() {
        wx.hideLoading();
    },

    refreshBills() {
        let that = this;
        this.showLoading()
        getBills(app.globalData.groupInfo._id)
            .then(res => {
                console.log('refresh Bills success')
                console.log(res)
                that.setData({
                    billList: res.data
                })
                that.hideLoading();
            })
            .catch(err => {
                console.log('refresh bills failed')
                console.log(err)
            })
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