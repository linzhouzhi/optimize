/**
 * Created by lzz on 17/2/20.
 */
var SSH = require('simple-ssh');
var config = require("../config.js");
var util = require("../util.js");
var app = config.app;
var urlencodedParser = config.urlencodedParser;

var ssh = new SSH({
    host: '192.168.1.107',
    user: 'lzz',
    pass: 'linzhouzhi'
});

function ssh_exe( param ) {
    ssh.exec('/home/lzz/test.sh ' + param, {
        out: function(stdout) {
            console.log(stdout);
            ssh.end();
        }
    }).start();
}


// 运行一个命令
function command_run(cid, host, user, pass, command) {
    var this_ssh = new SSH({host: host, user: user, pass: pass});
    var start_time = util.current_time();
    // 将 cid 命令的 status  改成 running
    util.running_command(cid);
    this_ssh.exec( command, {
        out: function(stdout) {
            // 修改成成功状态
            util.success_command(start_time, cid, stdout);
        },
        err: function(stderr) {
            // 修改成失败状态
            util.success_command(start_time, cid, stdout);
        }
    }).start();
}

// 检查命令的状态
function check_command(){
    // group host
    var db = util.db;
    db.all("SELECT host FROM commands group by host", function(err, rows) {  //根据 host group 后进行判断
        for(var index in rows){
            // status 2 表示 running 状态
            var check_sql = "select count(*) as c from commands where status=2 and host='"+rows[index].host+"'";
            db.each(check_sql, function(err, row) {
                if( row.c == 0 ){ // 如果没有任务在 running 那么就选择一个任务来运行
                    var running_sql = "select * from commands where status=1 and host='"+rows[index].host+"' order by cid limit 1";
                    db.each(running_sql, function(err, item) {
                        command_run( item.cid, item.host, item.username, item.password, item.command+item.param );
                    });
                };
            });
        }
    });
}

// command check
app.get('/command/check_ajax', function (req, res) {
    check_command();
});

// 1 waite, 2 running, 3 success, 4 fail, 5 delete, 6 kill
// kill 命令
app.post('/command/command_kill_ajax', urlencodedParser, function (req, res) {
    var cid = parseInt(req.body.cid);
    util.change_command_status(6, cid);
    res.end("");
});
// delete 命令
app.post('/command/command_delete_ajax', urlencodedParser, function (req, res) {
    var cid = parseInt(req.body.cid);
    console.log(cid + "----------");
    util.change_command_status(5, cid);
    res.end("");
});
// detail 命令
app.post('/command/command_detail_ajax', urlencodedParser, function (req, res) {
    var cid = parseInt(req.body.cid);

    var db = util.db;
    var detail_sql = "select status,log from commands where cid="+cid;
    db.each(detail_sql, function(err, item) {
        res.end(JSON.stringify(item));
        return;
    });

});

// 添加命令
app.get('/command/add', function (req, res) {
    res.render('add_command', {title:'paint title'});
});

// 命令列表
app.get('/command/list', function (req, res) {
    res.render('command_list', {title:'paint title'});
});

// 历史命令列表
app.get('/command/history', function (req, res) {
    var uuid = util.get_client_uuid(req);
    var db = util.db;
    db.all("SELECT * FROM commands where status<>5 and client_uuid='" + uuid + "'", function(err, rows) {
        res.render('command_history', {commands: rows,supplies:['mop', 'broom', 'duster']});
    });
});

// 用户提交命令
app.post('/command/command_submit_ajax', urlencodedParser, function (req, res) {
    var request_data = req.body;
    request_data.client_ip = util.get_client_ip(req);
    request_data.client_uuid = util.get_client_uuid(req);
    console.log( request_data );
    util.insert_commands(request_data);
    res.end(JSON.stringify(req.body));
})


exports.check_command = check_command;