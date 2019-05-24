//app.js

import config from './utils/config'
import './libs/wxPromise'
import { login, getOpenId } from './api/index';

App({
    onLaunch: function () {
        this.globalData = {};

        let loginPromise = getOpenId()
            .then(openId => {
                this.globalData.openId = openId;
                return login(openId)
            })
            .then(res => {
                console.log('login success')
                console.log(res)
                this.globalData.userInfo = res.userInfo
                this.globalData.isAdmin = res.isAdmin
                this.globalData.messages = res.messages
                this.globalData.groupInfo = res.groupInfo
                this.globalData.members = res.members
                this.globalData.userId = res.userId
            })
            .catch(err => {
                wx.navigateTo({
                    url: '/pages/authorization/authorizaion',
                })
                console.log('get open id failed')
                console.log(err)
            })
        this.globalData.loginPromise = loginPromise;
    }
})