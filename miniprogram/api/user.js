import db from "./db";

const usersDb = db.collection('user')
const groupDb = db.collection('group')

export function register(userInfo) {
    return usersDb.add({
        data: {
            userInfo: userInfo,
            isAdmin: false,
            lastLoginTime: new Date()
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
    usersDb.doc(userId).get()
        .then(res => {
            let user = res.data;
            if (user.groupId) {
                return groupDb.doc(user.groupId).get()
            }
        })
        .then(res => {
            if (res.data) {
                userData.groupInfo = res.data;
                return usersDb.where({
                    _id: _.in(res.data.members)
                })
            }
        })
        .then(res => {
            if (res.data) {
                userData.members = res.data;
            }
        })
        .then(() => {
            return Promise.resolve(userData);
        })
}