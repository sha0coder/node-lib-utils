#!/usr/bin/env node
//Google Search
//jesus.olmos@blueliv.com


var	http = require('http');


function parse(key,value) {
	if (key == 'unescapedUrl')
		console.log(value);
}

function jsonIterator(chunk) {
	//try {
		JSON.parse(chunk,parse); 

	//} catch (e) {	
	//	console.log(e);
	//}
}

function handleResponse(resp) {
	if (resp.statusCode != 200) 
		throw "response: " + response.statusCode;
	else
		resp.on('data',jsonIterator);  //FIXME: get all chunks
}

function search(keyword) {
	var host = 'ajax.googleapis.com';
	var get = '/ajax/services/search/web?v=1.0&q=';
	var client  = http.createClient(80, host);
	headers = '';
	var resp = client.request('GET', get+keyword, headers);
	resp.end();
	resp.on('response',handleResponse);
}


search(process.argv[2]);



