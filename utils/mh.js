#!/usr/bin/env node



var Url = require('../lib/url.js').Url;
var Crawl = require('../lib/crawl.js').Crawl;
var lines = require('../lib/loadlines.js');
var http = require('http');
var fs = require('fs');

var out;

function usage() {
    console.log('./mh.js -u [url]');
    console.log('./mh.js -f [file]');
    process.exit();
}

function crawl(base_url) {
    if (!base_url)
        usage();

    console.log('starting engine');
    var engine = new Crawl(base_url);
    engine.setDebug(false);

    engine.ee.on('url',handleUrl);
    engine.ee.on('end',crawlFinished);
    engine.start();
    console.log('started');
}

function massCrawl(file) {
    lines.loadLines(file, function(line) {
        crawl(line);
    });
}

function handleUrl(url,html) {
    console.log(url);
    out.write('=>'+url);
}

function crawlFinished() {

}

function main(opt,source) {
    if (!opt || !source)
        usage();

    out = fs.createWriteStream('out');

    switch (opt) {
        case '-u': crawl(source); break;
        case '-f': massCrawl(source); break;
        default: usage(); break;
    }
}

main(process.argv[2],process.argv[3]);

