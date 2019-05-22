import db from "./db";
import { getUnitId } from '../utils/index'

const groupDb = db.collection('group')
const userDb = db.collection('user')

export function createGroup(userId, name, intro) {
    return userDb.doc(userId).get()
        .then(res => {
            if (res.data.groupId) {
                return Promise.reject({
                    code: 1,
                    msg: 'user has join group'
                })
            }
            return groupDb.add({
                data: {
                    name: name,
                    intro: intro,
                    members: [userId],
                    admin: userId
                }
            })
        })
}


export function applyJoinGroup(userId, groupId) {
    groupDb.doc(groupId).get()
        .then(res => {
            let groupInfo = res.data;
            let applyMessage = {
                type: 1,
                userId: userId,
                id: getUnitId()
            }
            return userDb.doc(groupInfo.admin)
                .update({
                    data: {
                        messages: _.push(applyMessage)
                    }
                })
        });
}

export function acceptJoinGroup(admin, joinUserId, groupId) {
    groupDb.doc(groupId).get()
        .then(res => {
            let groupInfo = res.data
            if (admin !== groupInfo.admin) {
                return Promise.reject({ code: 1, msg: '不是管理员' });
            }
            return userDb.doc(joinUserId).get()


        })
        .then(res => {
            let userInfo = res.data;
            if (userInfo.groupId) {
                return Promise.reject({ code: 2, msg: '成员已经加入某个组' });
            }
            groupDb.doc(groupId)
                .update({
                    data: {
                        members: _.push(joinUserId)
                    }
                })
        })
}