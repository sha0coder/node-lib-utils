//callback launched for each line of a given file (non-concurrent)
// sha0@badchecskum.net
// @sha0coder


var fs = require('fs');

var debug = false;

function loadLines(filename,callback) {

        fs.readFile(filename,function(err,data) {
		if (err) throw err;

                data = data.toString().replace('\r','');
                var lines = data.split('\n');

                lines.forEach(callback);
                if (debug)
                    console.log('load finished.');     
        });
}

function setDebug(dbg) {
    debug = dbg;
}


exports.loadLines = loadLines;
exports.setDebug = setDebug;
