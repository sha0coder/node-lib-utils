//concurrent forEach
// sha0@badchecksum.net
// @sha0coder

var millis = 30;

function paralelizer(array, callback) {
	var a = array.concat();

        setTimeout(function() {
                callback(a.shift());
                if (a.length>0)
                        setTimeout(arguments.callee,millis);
        },millis);
}

exports.paralelizer = paralelizer


