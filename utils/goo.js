#!/usr/bin/env node


var goo = require('../lib/google.js');

goo.search(process.argv[2], function(url,title,content) {
    console.log('-------');
    console.log(url);
    console.log(title);
    console.log(content);
});

