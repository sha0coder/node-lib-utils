//sha0@badchecksum.net

var fs = require('fs'),
    word = require('./word.js');

var Wordlist = function() {
    this.clear();
    this.loaded = true;
    this.charset = 'utf-8';
    this.debug = false;
    this.onload_callback = null;
}


Wordlist.prototype = {

    on: function(ev,callback) {
        if (ev == 'load')
            this.onload_callback = callback;
    },

    setDebug: function(debug) {
        this.debug = debug;
    },

    setCharset: function(charset) {
        this.charset = charset;
    },

    clear: function() {
        this.words = [];
    },

    setLoading: function() {
        this.loaded=false;
        if (this.debug)
            console.log('Loading...');
    },

    setLoaded: function() {
        this.loaded=true;

        if (this.onload_callback) {
            this.onload_callback();
            this.onload_callback = null;
        }

        if (this.debug)
            console.log('Loaded.');
    },

    length: function() {
        return this.words.length;
    },

    count: function() {
        return this.words.length;    
    },

    load: function(filename) {
        this.setLoading(); 

        fs.loadFile(filename,this.charset,function(err,data) {
            if (err) throw err;

            data.split('\n').forEach(function(line) {
                this.words.push(line);     
            });

            this.setLoaded();
        });
    },
    
    save: function(filename) {
        var out = fs.createWriteStream(filename);

        this.words.forEach(function(w) {
            out.write(w);
        });

        out.end();
    },

    sort: function() {
        this.words = this.words.sort();
    },

    uniq: function() {
        var last = '';
        this.sort();
        var uniq = [];

        this.words.forEach(function(w) {
            if (w != last) {
                uniq.push(w);
                last = w; 
            }
        });

        this.words = uniq;
    },

    mins: function() {
    },

    mays: function() {
    },

    append: function(str) {
        for (var i=0; i<this.count(); i++) {
            this.words[i] += str; 
        }
    },

    prepend: function(str) {
        for (var i=0; i<this.count(); i++) {
            this.words[i] = str+this.words[i]; 
        }
    },

    replace: function(str1, str2) {
        for (var i=0; i<this.count(); i++) {
            this.words[i] = this.words[i].replace(str1,str2);
        }
    },

    shuflee: function() {
    },

    randomNums: function(amount,len) {
        self.setLoading();
        for (var i=0; i<amount; i++) {
            var word = [];
            for (var j=0; j<len; j++) {
                word.push(Math.floor(Math.random()*10)); 
            }
            this.words.push(word.join(''));
        }
        self.setLoaded();
    },

    randomAscii: function(amount,len) {
        self.setLoading();
        for (var i=0; i<amount; i++) {
            var word = '';
            for (var j=0; j<len; j++) {
                word += String.fromCharCode(Math.floor(Math.random()*(122-97))+97);    
            }
            this.words.push(word);
        }
        self.setLoaded();
    },

}


exports.Wordlist = Wordlist;
