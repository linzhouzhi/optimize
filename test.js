/**
 * Created by lzz on 17/3/23.
 */

/*
var fs = require("fs");
var file = "optimize.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();


function deepCopy(source) {
    var result={};
    for (var key in source) {
        result[key] = typeof source[key]==='object'? deepCopy(source[key]): source[key];
    }
    return result;
}

function all_commands() {
    var ress = [];
    var db = new sqlite3.Database(file);
    db.all("SELECT host FROM commands group by host", function(err, rows) {
        for(var index in rows){
            var check_sql = "select count(*) as c from commands where status=2 and host='"+rows[index].host+"'";
            db.each(check_sql, function(err, row) {
                if( row.c == 0 ){ // 启动任务
                    var running_sql = "select * from commands where status=1 and host='"+rows[index].host+"' order by cid limit 1";
                    db.each(running_sql, function(err, item) {
                        console.log(item);
                    });
                }
            });

        }
    });

}

var res = all_commands();

*/
var SSH = require('simple-ssh');

var ssh = new SSH({
    host: '192.168.1.107',
    user: 'lzz',
    pass: 'linzhouzhi'
});

function ssh_exe( param ) {
    ssh.exec('/home/lzz/test.sh ' + param, {
        out: function(stdout) {
            console.log(stdout+"sssss" + param);
            ssh.end();
        },
        err: function(stderr) {
            console.log(stderr+"eeeeeee");
            ssh.end();
        },
        exit: function(code) {
            console.log(code); // 69
        }
    }).start();
}

ssh_exe(1);
