import db from "./db";
const _ = db.command
const usersDb = db.collection('user')
const groupDb = db.collection('group')


export function register(userInfo) {
    return usersDb.add({
        data: {
            userInfo: userInfo,
            isAdmin: false,
            lastLoginTime: new Date(),
            messages: []
        }
    })
}

export function getOpenId() {
    // 调用云函数
    return new Promise(function(resolve, reject) {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => resolve(res.result.openid),
            fail: reject
        })
    })
}

export function login(openId) {
    let userData = {};
    let app = getApp();
    return usersDb.where({
            _openid: openId
        }).get()
        .then(res => {
            let user = res.data.length > 0 && res.data[0];
            if (!user) {
                return Promise.reject({
                    code: 1,
                    msg: 'user not found'
                })
            }
            userData.isAdmin = user.isAdmin
            userData.messages = user.messages
            userData.userInfo = user.userInfo
            userData.userId = user._id;
            app.globalData.userInfo = userData.userInfo
            app.globalData.isAdmin = userData.isAdmin
            app.globalData.messages = userData.messages
            app.globalData.userId = userData.userId
            if (user.groupId) {
                return groupDb.doc(user.groupId).get()
            }
        })
        .then(res => {
            if (res && res.data) {
                userData.groupInfo = res.data;
                app.globalData.groupId = res.data._id;
                app.globalData.groupInfo = userData.groupInfo
                return usersDb.where({
                    _id: _.in(res.data.members)
                }).get()
            }
        })
        .then(res => {
            if (res && res.data) {
                userData.members = res.data;
            }
            app.globalData.members = userData.members

            return Promise.resolve(userData);
        })
}

export function clearMessage(userId, messageId) {
    return usersDb.doc(userId).get()
        .then(res => {
            if (res.data) {
                let messages = res.data.messages;
                messages.filter(message => message.id !== messageId);
                return usersDb.doc(userId).update({
                    data: {
                        messages: messages
                    }
                });
            } else {
                return Promise.reject({
                    code: 1,
                    msg: 'user not found'
                });
            }
        })
}