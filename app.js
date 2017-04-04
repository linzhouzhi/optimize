var config = require("./config.js");
var command = require("./controller/command.js");
var schedule = require('node-schedule');
var app = config.app;


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);

    schedule.scheduleJob('30 * * * * *', function(){
        console.log("schedulejobbbbbbbbbbbbbb");
        command.check_command();
    });
})