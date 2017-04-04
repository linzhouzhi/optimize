/**
 * Created by lzz on 17/4/3.
 */

var fs = require("fs");
var file = "optimize.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

/**
 *  初始化数据库
 * @param fs
 * @param file
 * @param db
 */
function init_db() {
    if(!exists) {
        console.log("Creating DB file.");
        fs.openSync(file, "w");
        db.run("CREATE TABLE commands " +
            "(cid INTEGER PRIMARY KEY autoincrement," +
            "host text," +
            "username text," +
            "password text," +
            "client_ip text,"+
            "client_uuid text,"+
            "command text," +
            "param text,"+
            "add_time int," +
            "start_time int," +
            "end_time int, " +
            "run_time int, " +
            "status int," +  // 1 waite, 2 running, 3 success, 4 fail, 5 delete, 6 kill
            "log text)");
    }
}

/**
 * 插入数据
 * @param req_data
 */
function insert_commands( req_data ) {
    var stmt = db.prepare("INSERT INTO commands(host,username,password,client_ip,client_uuid,command," +
        "param,add_time,start_time,end_time,run_time,status,log)" +
        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    var param = req_data.param.split("|");
    for (var i = 0; i < param.length; i++) {
        stmt.run(req_data.host,req_data.username, req_data.password, req_data.client_ip,req_data.client_uuid,req_data.command,param[i],current_time(),0,0,0,1,"");
    }
    stmt.finalize();
}

/**
 * 将命令修改成运行状态
 * @param cid
 */
function running_command(cid) {
    var stmt = db.prepare("UPDATE commands set status=2,start_time=? where cid =?");
    stmt.run(current_time(), cid);
    stmt.finalize();
}
/**
 * 修改命令成功状态
 * @param start_time
 * @param cid
 */
function success_command(start_time,cid,log) {
    var run_time = current_time() - start_time;
    var stmt = db.prepare("UPDATE commands set status=3,end_time=?,run_time=" + run_time + ",log='" + log + "' where cid =?");
    stmt.run(current_time(), cid);
    stmt.finalize();
}
/**
 * 修改命令成失败状态
 * @param start_time
 * @param cid
 */
function fail_command(start_time,cid, log) {
    var run_time = current_time() - start_time;
    var stmt = db.prepare("UPDATE commands set status=4,end_time=?,run_time=" + run_time + ",log='" + log + "' where cid =?");
    stmt.run(current_time(), cid);
    stmt.finalize();
}
/**
 * 修改命令的权限
 * @param status
 * @param cid
 */
function change_command_status(status, cid) {
    var stmt = db.prepare("UPDATE commands set status=? where cid =?");
    stmt.run(status, cid);
    stmt.finalize();
    return 1;
}
/**
 * 根据用户 uuid 返回所有的 command
 * @param uuid
 */
function all_commands(uuid) {
    var res = [];
    db.all("SELECT * FROM commands where client_uuid='" + uuid + "'", function(err, rows) {
        res = rows;
    });
    console.log(res);
    return res;
}
/**
 * 获取当前时间错
 */
function current_time(){
    var timestamp=new Date().getTime();
    return timestamp;
}

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
exports.current_time = current_time;

exports.db = db;
init_db(); // 初始化数据库

exports.insert_commands = insert_commands;
exports.all_commands = all_commands;
exports.running_command = running_command;
exports.success_command = success_command;
exports.fail_command = fail_command;
exports.change_command_status = change_command_status;
