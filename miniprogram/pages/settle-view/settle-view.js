import { getBills, beginSettle, getSettleInfo, confirmSettle, settlementClear } from "../../api/index";
import { formatMoney } from "../../utils/index";

const app = getApp();

// miniprogram/pages/settle-view/settle-view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settleList: [],
    isShowShare: false,
    isShowBegin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('before get bills')
    app.globalData.loginPromise
      .then(() => getBills(app.globalData.groupId))
      .then(res => {
        console.log('after get bills....')
        console.log(res);
        return this.settleHander(res.data)
      })
      .then(() => {
        let isShowBegin = false;
        if (app.globalData.isAdmin && !this.data.settleInfo) {
          isShowBegin = true;
        }

        this.setData({
          isShowBegin
        })
      })
  },

  settleHander(bills) {
    let result = {};
    let total = 0;

    for (const bill of bills) {
      total += bill.money;
      let memberSettleData = result[bill._openid]
      if (!memberSettleData) {
        memberSettleData = result[bill._openid] = {
          paidOut: 0,
          needToSpend: 0
        };
      }

      memberSettleData.paidOut += bill.money;
      let average = bill.money / bill.participants.length
      for (const participant of bill.participants) {
        let participantSettleData = result[participant];
        if (!participantSettleData) {
          participantSettleData = result[participant] = {
            paidOut: 0,
            needToSpend: 0
          }
        }
        participantSettleData.needToSpend += average;
      }
    }
    console.log('bill result', result);
    let adminInfo = app.globalData.members.find(member => member._id === app.globalData.groupInfo.admin);
    let settleList = Object.keys(result)
      .map(openId => {
        let userInfo = app.globalData.members.find(member => member._openid === openId)
        let money = result[openId].paidOut - result[openId].needToSpend;
        let item = {
          money: formatMoney(Math.abs(money))
        };
        if (money > 0) {
          item.form = adminInfo;
          item.to = userInfo;
        } else {
          item.form = userInfo;
          item.to = adminInfo;
        }
        return item;
      })
      .filter(settleItem => !settleItem.form.isAdmin || !settleItem.to.isAdmin)

    return getSettleInfo(app.globalData.groupId)
      .then(settleInfo => {
        if (settleInfo) {
          for (const confirmMember of settleInfo.confirmMembers) {
            if (confirmMember === adminInfo._openid) {
              continue;
            }
            for (const settleItem of settleList) {
              if (settleItem.form._openid === confirmMember || settleItem.to._openid === confirmMember) {
                settleItem.isConfirm = true;
              }
            }
          }
        }

        this.setData({
          settleInfo: settleInfo || null,
          settleList,
          total,
          membersPayment: result,

        })
      })
  },

  beginSettlement() {
    if (!app.globalData.isAdmin) {
      wx.showToast({
        title: '不是管理员无法开始结算'
      })
      return;
    }
    return beginSettle(app.globalData.groupId, app.globalData.openId, this.data.total, this.data.membersPayment)
      .then(res => {
        // wx.showToast({
        //   title: '已经开始结算，在结清前无法添加新账单'
        // })
        this.setData({
          isShowShare: true,
          isShowBegin: false
        })
      })
  },

  confirmSettlement() {
    if (app.globalData.isAdmin) {
      if (this.data.settleInfo.confirmMembers.length === this.data.settleList.length + 1) {
        wx.showLoading();
        settlementClear(app.globalData.groupId)
          .then((res) => {
            console.log('settlement clear ...')
            console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '账单已结算完成'
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/bills/bills'
              })
            }, 1500);
          })
          .catch(err => {
            console.log('settle clear failed');
            console.log(err);
          })
      } else {
        wx.showToast({
          title: '还有成员未确认账单'
        })
      }
    } else {
      console.log('before confirm settle')
      confirmSettle(app.globalData.groupId)
        .then((res) => {
          console.log('confrim success');
          console.log(res)
          wx.showToast({
            title: '账单已确认'
          })
          this.onLoad();
        })
        .catch(err => {
          console.log('confirm failed')
          console.log(err)
        })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      isShowShare: false
    })
    return {
      path: '/pages/settle-view/settle-view',
      title: "请查收你的账单"
    }
  }
})