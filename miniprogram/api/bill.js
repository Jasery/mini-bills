import db from "./db";

const usersDb = db.collection('bill')

export function register(userInfo) {
    return usersDb.add({
        data: {
            userInfo: userInfo,
            isAdmin: false,
            lastLoginTime: new Date()
        }
    })
}