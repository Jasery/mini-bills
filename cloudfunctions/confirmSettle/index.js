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
      groupId
    })
    .get()
  console.log('settle res')
  console.log(settleInfos)
  let settleInfo = settleInfos.data[0];
  if (!settleInfo) {
    return {
      code: 0,
      msg: 'no settle info'
    }
  }
  if (settleInfo.confirmMembers.indexOf(openId) < 0) {
    console.log('before ')
    await db.collection('settle')
      .doc(settleInfo._id)
      .update({
        data: {
          confirmMembers: _.push(openId)
        }
      });
  }

  return {
    code: 1,
    msg: 'confirm succss'
  }
}