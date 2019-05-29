// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('bills').get()
  const wxContext = cloud.getWXContext()

  let openId = wxContext.OPENID;
  let groupId = event.groupId;
  console.log('groupId', groupId)
  db.collection('group')
    .doc(groupId)
    .get()
    .then(res => {
      console.log('group Info-')
      console.log(res)
    })
    .catch(err => {
      console.log('find group err')
      console.log(err)
    })
    // console.log(groupInfo)
  // let settleInfos = await db.collection('settle')
  //   .where({
  //     groupId
  //   })
  //   .get()
  // console.log('settle res')
  // console.log(settleInfos)
  // let settleInfo = settleInfos[0];
  // if (!settleInfo) {
  //   return {
  //     code: 0,
  //     msg: 'no settle info'
  //   }
  // }
  // if (settleInfo.confirmMembers.indexOf(openId) < 0) {
  //   await db.collection('group')
  //     .doc(groupId)
  //     .update({
  //       data: {
  //         confirmMembers: _.push(openId)
  //       }
  //     });
  // }

  // return {
  //   code: 1,
  //   msg: 'confirm succss'
  // }
}