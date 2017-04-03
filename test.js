/**
 * Created by lzz on 17/3/23.
 */

/*
var SSH = require('simple-ssh');
var ssh = new SSH({
    host: '192.168.1.107',
    user: 'lzz',
    pass: 'linzhouzhi'
});
ssh.exec('ls -l /', {
    out: function(stdout) {
        console.log(stdout);
    }
}).start();
*/

var schedule = require('node-schedule');

function scheduleCronstyle(){
    schedule.scheduleJob('30 * * * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
    });
}

scheduleCronstyle();