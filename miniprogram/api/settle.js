import db from "./db";

const settleDb = db.collection('settle')
const groupDb = db.collection('group')

export function settle(groupId) {
    // TODO: 
}

export function settlementClear(groupId) {
    return groupDb.doc(groupId)
        .update({
            data: {
                isSettlement: false
            }
        })
}