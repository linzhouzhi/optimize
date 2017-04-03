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

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
    db.run("CREATE TABLE lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();