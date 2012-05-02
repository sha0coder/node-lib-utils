#!/usr/bin/env node
//Google Search
//jesus.olmos@blueliv.com


var Url = require('./url.js').Url;
var callback = null;
var maxPages = 5;

var url;
var title;
var content;

function setMaxPages(pages) {
    maxPages = pages;
}

function parse(key,value) {
    switch (key) {
        case 'unescapedUrl':
            url = value;
            break;
        case 'titleNoFormatting':
            title = value;
            break;
        case 'content':
            callback(url,title,value);
            break;
    }
}

function search(keyword,cb) {
    var url = new Url('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q='+keyword);

    callback = cb;

    url.getHtml(function(ok,html) {
        if (ok)
            JSON.parse(html,parse);
    });
}

exports.search = search;
exports.setMaxPages = setMaxPages;
