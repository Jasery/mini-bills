//app.js

import config from './utils/config'
import './libs/wxPromise'

App({
    onLaunch: function() {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
                env: config.cloudEnv
            })
        }

        if (!wx.getStorageSync('userInfo')) {
            console.log('meiyou storage')
            wx.navigateTo({
                url: '/pages/authorization/authorizaion',
            })
        }

        this.globalData = {}
    }
})