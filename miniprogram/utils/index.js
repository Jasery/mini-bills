
import { $wuxToast } from '../components/wux/index';

export function getUnitId() {
    return Date.now() * 1000 + randomNum(0, 1000)
}

export function randomNum(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

export function formatMoney(money) {
    return Number(money.toFixed(2));
}

/**
 * 上传文件，直接返回fileID
 * @param {String} groupId 分组id
 * @param {String} filePath 文件临时路径
 */
export function uploadFile(groupId, filePath) {
    let ext = filePath.substring(filePath.lastIndexOf('.'));
    let cloudPath = `mini-bills/${groupId}_${Date.now()}${ext}`;
    return wx.cloud.uploadFile({
        cloudPath,
        filePath
    }).then(res => res.fileID)
}

export function showToast(type, text, callback = null) {
    $wuxToast().show({
        type,
        text,
        success: callback
    })
}