#!/usr/bin/env node

//Bing Search
//jesus.olmos@blueliv.com


var	http = require('http');


var api_key = 'PUT API KEY HERE';
var base_url = 'http://api.search.live.net/json.aspx?Appid=';

var debug = false;
var offset;
var pending;
var count;
var requests;

function setDebug(dbg) {
    debug = dbg;
}

function search(keyword, callback, end_callback) {
	try {
	offset = 0;
	pending = 150;
	count = 50;
	requests = 0;

        if (debug)
            console.log('searching:'+keyword);

	while (pending > 0) {


		var target = {
			host:  'api.search.live.net',
			port: 80,
			path: base_url+api_key+'&Query='+escape(keyword)+'&sources=web&web.offset='+offset+'&web.count='+count
		};


		if (pending < 50) {
			count = pending;
			pending = 0;	
		}

	       	offset += 50;
		count = 50;
       		pending -= 50;
		if (pending <50) 
			count = pending;

		requests ++;
		http.get(target, function(resp) {
			var out = '';

			if (resp.statusCode != 200) {
				console.log('fail!! '+resp.statusCode);
				return resp.statusCode;
			}

			resp.on('data', function(chunk) {
				out += chunk;
			});
    			resp.on('end', function() { 
			var title = '';
			var description = '';
                        try {
                            JSON.parse(out, function (key,value) {

				if (key == 'Title') 
                                    title = value;
				if (key == 'Description') 
                                    description = value;
				if (key == 'Url') 
                                    callback(value, title, description);

				if (key == 'SearchResponse')
                                    if (--requests <= 0)
                                            if (end_callback)
                                                    end_callback();
				});
                            } catch (e) {
                           
                            }
                        });
                 
		});

 	}
	} catch(e) {
		console.log('error captured');
	}

}



exports.search = search;
exports.setDebug = setDebug;

/*
(function () {
	if (process.argv[2]) {
		var start = new Date().getTime();

		process.on('exit', function () {
			var now = new Date().getTime();

			console.log('time: '+(now-start)+' milisecs.');
		});

		search(process.argv[2],function (url,title,desc) {
			console.log(url);
			console.log(title);
			console.log(desc);
			console.log('');
		},null);

	}	
})();*/

