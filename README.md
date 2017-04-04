# Optimize

* 1、npm install express --save //web 框架
* 2、npm install body-parser --save
* 3、npm install cookie-parser --save
* 4、npm install multer --save
* 5、npm install ejs --save //前端模版引擎
* 6、npm install simple-ssh --save  // 执行命令通过ssh
* 7、npm install --save better-sqlite3 (python2.7) // 数据保存在 sqlite
* 8、npm install moment // 前端时间模版格式化

* node app.js
* http://127.0.0.1:8081/command/add
json param:  -n  1-4-2
string param: -direct

git push -u origin master

参数写入到 mysql 中，然后通过定时器进行判断如果 同一个主机已经有命令处于 runing 那么就不做任何操作，如果没有
就顺序选择一个运行并设置状态 running
ssh 运行成功设置 success 否则设置 fail


#
sparksql  --driver-memory 2G,3G  --num-executors 3
sqoop --direct  -m
