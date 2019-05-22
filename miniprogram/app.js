//app.js

import config from './utils/config'
import './libs/wxPromise'
import { login } from './api/index';

App({
    onLaunch: function() {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {}

        if (!wx.getStorageSync('userInfo')) {
            console.log('meiyou storage')
            wx.navigateTo({
                url: '/pages/authorization/authorizaion',
            })
            return;
        }
        console.log('before login')
        let loginPromise = login(wx.getStorageSync('userId'))

        this.globalData = {
            loginPromise
        }
    }
})