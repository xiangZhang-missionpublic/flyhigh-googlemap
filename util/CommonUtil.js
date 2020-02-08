const Error = require('./Error');
const logger = require('./Logger').createLogger('CommonUtil.js');
const model = require('../model');
const tb_action_log = model.common_action_log;
// common response
exports.sendData = async (res, result, errMsg, next) => {
    res.send(200, {success: true, result: result, msg: errMsg});
    // _actionLog(res, {success: true, result: result, msg: errMsg});
    if (next) {
        return next();
    }
};

exports.sendDataWithToken = async (res, result, token,errMsg, next) => {
    res.send(200, {success: true,token: token, result: result, msg: errMsg});
    // _actionLog(res, {success: true, result: result, msg: errMsg});
    if (next) {
        return next();
    }
};

exports.resetQueryRes = async (res, result, errMsg, next) => {
    res.send(200, {success: true, result: result, msg: errMsg});
    _actionLog(res, {success: true, result: result, msg: errMsg});
    if (next) {
        return next();
    }
};

exports.resetSuccessRes = async (res, next) => {
    res.send(200, {success: true});
    _actionLog(res, {success: true});
    if (next) {
        return next();
    }
};


exports.sendError = async (res, err, msg) => {
    let err_res = err ? err : -1;
    let msg_res = msg ? msg : 'error';
    let sendData = {};
    if (err_res in Error) {
        sendData = {
            errno: err_res,
            msg: Error[err_res]
        };
    } else {
        sendData = {
            errno: err_res,
            msg: msg_res
        };
    }
    // res.status(200).send(sendData);
    res.send(200, sendData);
    _actionLog(res, sendData);
};

exports.sendFault = async (res, msg, next) => {
    let msgres = arguments[1] ? arguments[1] : 'Internal Error';
    let sendData = {};
    // logger.error(msg);
    if (process.env.NODE_ENV === 'test') {
        sendData = {
            errno: -1,
            msg: msgres.message,
        };
    } else {
        sendData = {
            errno: -1,
            msg: msgres.message,
        };
    }
    res.status(500,sendData);
    _actionLog(res, sendData);
    if (next) {
        return next();
    }
};

exports.resInternalError = (error, res, next) => {
    let msgres = arguments[1] ? arguments[1] : 'Internal Error';
    let sendData = {};
    // logger.error(msg);
    if (process.env.NODE_ENV === 'test') {
        sendData = {
            errno: -1,
            msg: msgres.message,
        };
    } else {
        sendData = {
            errno: -1,
            msg: msgres.message,
        };
    }
    res.status(500,sendData);
    _actionLog(res, sendData);
    if (next) {
        return next();
    }
};

let docTrim = (req) => {
    let doc = req;
    for (let idx in doc) { //不使用过滤
        if (typeof(doc[idx]) == "string") {
            doc[idx] = doc[idx].trim();
        }
    }
    return doc
};
exports.docTrim = docTrim;
let _actionLog = async (res, sendData) => {
    let req = res.req;
    let action_ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if (action_ip.indexOf(',') > 0)
        action_ip = action_ip.split(',')[0];
    let action_params = JSON.stringify(docTrim(req.body) || {});
    let action_result = `${res.statusCode} ${JSON.stringify(sendData || {})}`;
    if (action_params && action_params.length > 300) action_params = action_params.substr(0, 299);
    if (action_result && action_result.length > 500) action_result = action_result.substr(0, 499);
    await tb_action_log.create({
        action_route: `${req.method} ${res.req.url}`,
        action_params: action_params,
        action_user_id: (req.user ? req.user.user_id : 0) || 0,
        action_user_name: (req.user ? req.user.username : '') || '',
        action_ip: action_ip,
        action_user_type: (req.user ? req.user.type : '') || '',
        action_user_device: req.headers['user-agent'] || req.headers['User-Agent'],
        action_result: action_result,
        action_auth_token: req.headers['authorization'] || ''
    });
};
Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

exports.simpleSelect = async (db, queryStr, replacements) => {
    return await db.query(queryStr, {
        replacements: replacements,
        type: db.QueryTypes.SELECT
    });
};
// exports.simpleInsert = async (db, queryStr, replacements) => {
//     return await db.query(queryStr, {
//         replacements: replacements,
//         type: db.QueryTypes.SELECT
//     });
// };
exports.simpleUpdate = async (db, queryStr, replacements) => {
    return await db.query(queryStr, {
        replacements: replacements,
        type: db.QueryTypes.UPDATE
    });
};
exports.selectCount = async (db, queryStr, replacements) => {
    let cnt = queryStr.indexOf("from") + 5;
    let queryStrCnt = queryStr.substr(cnt);
    let count = await db.query('select count(*) num from ' + queryStrCnt, {
        replacements: replacements,
        type: db.QueryTypes.SELECT
    });
    return count && count.length > 0 ? count[0].num : -1;
};

//列表分页查询，查询语句queryStr传完整的sql语句
let queryWithCount = async (db, req, queryStr, replacements) => {
    try {
        let doc = req.body;
        let cnt = queryStr.indexOf("from") + 5;
        let queryStrCnt = queryStr.substr(cnt);
        let count = await db.query('select count(*) num from ' + queryStrCnt, {
            replacements: replacements,
            type: db.QueryTypes.SELECT
        });
        let rep = replacements;
        rep.push(doc.offset || 0);
        rep.push(doc.limit || 100);
        let queryRst = await db.query(queryStr + ' LIMIT ?,?', {
            replacements: rep,
            type: db.QueryTypes.SELECT
        });
        return {
            count: count && count.length > 0 ? count[0].num : 0,
            data: queryRst
        }
    } catch (error) {
        logger.error(error.message);
    }
};
exports.queryWithCount = queryWithCount;


/**
 * 事务方法
 */
exports.transaction = (callback) => {
    return new Promise(function (resolve, reject) {
        model.sequelize.transaction(callback).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    })
};
exports.getApiName = (path) => {
    if (path) {
        let patha = path.split('/');
        return patha[patha.length - 1].toUpperCase();
    } else return '';
};

exports.parseEnum = (text, arr) => {
    for (let a of arr)
        if (a.text == text)
            return a.id;
    return null;
};
/**
 * 快速排序
 * @param arr
 * @param key
 * @returns {*}
 */
let quickSort = function (arr, key) {
    if (arr.length <= 1) {
        return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] <= pivot[key]) {
            left.push(arr[i]);
        }
        else {
            right.push(arr[i]);
        }
    }
    if (pivot)
        return quickSort(left, key).concat([pivot], quickSort(right, key));
    else
        return quickSort(left, key).concat(quickSort(right, key));
};

let getVariance = (arr) => {
    let sum = 0;
    for (let a of arr) {
        sum += a * 1.0000;
    }
    let avg = sum / arr.length * 1.0000;
    let s2 = 0.0000;
    for (let a of arr) {
        s2 += (a - avg) ^ 2
    }
    return s2 / arr.length * 1.0000;
};


exports.quickSort = quickSort;

exports.getVariance = getVariance;


exports.getClientIp = (req) => {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if (ip.indexOf(',') > 0)
        ip = ip.split(',')[0];
    return ip;
};

exports.isBlank = (str) => {
};