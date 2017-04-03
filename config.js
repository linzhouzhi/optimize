/**
 * Created by lzz on 17/4/2.
 */

var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

exports.express = express;
exports.ejs = ejs;
exports.path = path;
exports.app = app;
exports.urlencodedParser = urlencodedParser;