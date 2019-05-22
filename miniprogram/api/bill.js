import db from "./db";

const billsDb = db.collection('bill')

export function register(userInfo) {
    return usersDb.add({
        data: {
            userInfo: userInfo,
            isAdmin: false,
            lastLoginTime: new Date()
        }
    })
}


export function getBills(groupId) {
    return billsDb.where({
        groupId: groupId
    }).get();
}

export function createBill(billInfo) {
    return billsDb.add({
        data: billInfo
    })
}