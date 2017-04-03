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

function exe_all( results, params ) {
    for(var item_arr in results){
        var values = results[item_arr];
        var i = 0;
        var str = "";
        for( var key in params ){
            str += key + " : " + values[i] + " | ";
            i++;
        }
        ssh_exe( str );
    }
}

// 检查命令的状态
function check_command(){
    // group host
    // 如果 host 对应的 command 没有running 就启动一个 command 运行
    // 运行完成后执行回调方法 成功就改成功状态失败就改失败状态
}

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
    res.render('command_history', {title:'paint title'});
});

// 用户提交命令
app.post('/command/command_submit_ajax', urlencodedParser, function (req, res) {
    var request_data = req.body;
    request_data.client_ip = util.get_client_ip(req);
    request_data.client_uuid = util.get_client_uuid(req);
    console.log( request_data );
    res.end(JSON.stringify(req.body));
})
