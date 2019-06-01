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

  let openId = event.openId || wxContext.OPENID;
  let groupId = event.groupId;
  console.log('open id', openId);
  console.log('groupId ', groupId);
  let settleInfos = await db.collection('settle')
    .where({
      groupId: groupId,
      isClear: false
    })
    .get()
  let settleInfo = settleInfos.data[0];
  console.log('settle info')
  console.log(settleInfo)
  if (!settleInfo) {
    return {
      code: 0,
      msg: 'no settle info'
    }
  }
  if (settleInfo.confirmMembers.indexOf(openId) < 0) {
    console.log('before update ')
    await db.collection('settle')
      .doc(settleInfo._id)
      .update({
        data: {
          confirmMembers: _.push(openId)
        }
      });
    console.log('update success.');
  }

  return {
    code: 1,
    msg: 'confirm succss'
  }
}