import db from "./db";

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

export function login(userId) {
    let userData = {};
    return usersDb.doc(userId).get()
        .then(res => {
            let user = res.data;
            userData.isAdmin = user.isAdmin
            userData.messages = user.messages
            if (user.groupId) {
                return groupDb.doc(user.groupId).get()
            }
        })
        .then(res => {
            if (res && res.data) {
                userData.groupInfo = res.data;
                return usersDb.where({
                    _id: _.in(res.data.members)
                })
            }
        })
        .then(res => {
            if (res && res.data) {
                userData.members = res.data;
            }
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