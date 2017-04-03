var config = require("./config.js");
require("./controller/command.js");
var schedule = require('node-schedule');

var app = config.app;
var urlencodedParser = config.urlencodedParser;

app.get('/index.htm', function (req, res) {
    //res.sendFile( __dirname + "/" + "index.htm" );
    res.render('index', {title:'paint title'});
})

/* ------------------------- demo start --------------------------*/
app.get('/demo', function (req, res) {
    console.log( req.query.page );
    res.render('demo/index', {title:'paint title'});
})

app.post('/ajax_demo', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    var rand = Math.random();
    var admin_list = {"admin_list":[{"id":rand,"admin_name":"aaaaabnbm","admin_pwd":"c3e61d5768d7eb88902b30fb253ee18f","type":"3","login_time":"0"},{"id":"645","admin_name":"dcfsafcdsjn","admin_pwd":"0539c5e609286a3fa6a0f3d614b3f7e0","type":"4","login_time":"0"},{"id":"644","admin_name":"huang777","admin_pwd":"asdfads","type":"0","login_time":"0"},{"id":"637","admin_name":"sadfw","admin_pwd":"5744a91e46bc4d6233785eab194e7853","type":"4","login_time":"0"},{"id":"636","admin_name":"no636111","admin_pwd":"a711680881ebe2f079ae87715775ffd5","type":"4","login_time":"0"},{"id":"635","admin_name":"zzzzzzbbb","admin_pwd":"d4a805a07e66ce22f3f511823b38dd08","type":"3","login_time":"0"}],"page_count":106,"page":req.body.page};
    res.end(JSON.stringify(admin_list));
})


app.post('/ajax_edit_demo', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    var rand = Math.random();
    var admin_list = {"rs":{"id":rand,"admin_name":"aaaaabnbm","admin_pwd":"c3e61d5768d7eb88902b30fb253ee18f","type":"3","login_time":"0"}};
    res.end(JSON.stringify(admin_list));
})



/* ------------------------- demo   end --------------------------*/

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

    schedule.scheduleJob('30 * * * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
    });
})