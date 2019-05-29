// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let openId = wxContext.OPENID;
  let groupId = event.groupId;

  let settleInfos = db.collection('settle')
    .where({
      groupId
    })
    .get()
  let settleInfo = settleInfos[0];
  if (!settleInfo) {
    return {
      code: 0,
      msg: 'no settle info'
    }
  }


  await db.collection('group').doc(groupId)
    .update({
      data: {
        isSettlement: false
      }
    })
  
  let bills = await db.collection('bill')
    .where({
      groupId
    }).get()
  
bills.map(bill => {
  bill.settleId = settleInfo._id;
}).forEach(bill => {
  db.collection('bill-history').add({
    data: bill
  })
})

await db.collection('settle').doc(settleInfo._id)
  .update({
    data: {
      isClear: true
    }
  })

  return {
    code: 1,
    msg: 'clear succss'
  }
}