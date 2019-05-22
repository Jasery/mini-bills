import config from "../utils/config";
wx.cloud.init({
    traceUser: true,
    env: config.cloudEnv
})
let db = wx.cloud.database({
    env: config.cloudEnv
});
export default db;