import config from "../utils/config";
let db = wx.cloud.database({
    env: config.cloudEnv
});
export default db;