/**
 * Created by lzz on 17/4/3.
 */

/**
 * 获取客户端 uuid(保存在 cookie 里面)
 * @param req
 * @returns {*}
 */
function get_client_uuid(req) {
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return cookies['uuid'];
}

/**
 * 获取客户端 ip
 * @param req
 * @returns {*}
 */
function get_client_ip(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};


// 初始化 sqlite optimize 数据
// 插入数据到 optimize 表
// 根据 uuid 读取 optimize 表的内容

exports.get_client_uuid=get_client_uuid;
exports.get_client_ip = get_client_ip;
