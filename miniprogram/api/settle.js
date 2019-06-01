import db from "./db";

const settleDb = db.collection('settle')
const groupDb = db.collection('group')

export function confirmSettle(groupId) {
    return wx.cloud.callFunction({
        name: 'confirmSettle',
        data: {
            groupId
        }
    })
}

export function beginSettle(groupId, adminOpenId, total, membersPayment) {
    let settleInfo = {
        time: new Date(),
        groupId: groupId,
        total: total,
        membersPayment: membersPayment,
        isClear: false,
        confirmMembers: [adminOpenId]
    };
    console.log('before add settle info')
    console.log(settleInfo);
    return settleDb.add({
        data: settleInfo
    }).then(res => {
        return groupDb.doc(groupId)
            .update({
                data: {
                    isSettlement: true
                }
            })
    })
}

export function settlementClear(groupId) {
    return wx.cloud.callFunction({
        name: 'clearSettle',
        data: {
            groupId
        }
    })
}

export function getSettleInfo(groupId) {
    return settleDb.where({
        groupId: groupId,
        isClear: false
    }).get()
        .then(res => {
            if (res.data) {
                return res.data[0];
            }
            return null;
        })
}