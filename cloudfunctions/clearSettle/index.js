// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-1e22ad'
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let openId = wxContext.OPENID;
  let groupId = event.groupId;

  let settleInfos = await db.collection('settle')
    .where({
      groupId,
      isClear: false
    })
    .get()
  let settleInfo = settleInfos.data[0];
  if (!settleInfo) {
    return {
      code: 0,
      msg: 'no settle info'
    }
  }

  let bills = await db.collection('bill')
    .where({
      groupId
    }).get()

  bills.data.forEach(bill => {
    bill.settleId = settleInfo._id;
    db.collection('bill-history').add({
      data: bill
    })
  })

  // for (let bill of bills) {
  //   bill.settleId = settleInfo._id;
  //   let ret = await db.collection('bill-history').add({
  //     data: bill
  //   })
  // }

  await db.collection('bill').where({
    groupId
  }).remove()

  await db.collection('settle').doc(settleInfo._id)
    .update({
      data: {
        isClear: true
      }
    })

  await db.collection('group').doc(groupId)
    .update({
      data: {
        isSettlement: false
      }
    })
  return {
    code: 1,
    msg: 'clear succss'
  }
}