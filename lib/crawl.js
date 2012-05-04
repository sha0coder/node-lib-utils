// sha0@badchecksum.net
// @sha0coder

var Url = require('./url.js').Url;
var EventEmitter = require('events').EventEmitter;

var Crawl = function(url) {
    this.ee = new EventEmitter();
    if (url)
        this.setUrl(url);
    else
        this.init_url = null;

    this.onurl_callback = null;
    this.onend_callback = null;
    this.running = false;
    this.reg_href = /href *= *"?'?([^> "']+)"?'?/ig;
    this.debug = false;
    this.parsed = [];
    this.counter = 0;
}


Crawl.prototype = {

    setDebug: function(dbg) {
        this.debug = dbg;
    },

    setUrl: function(url) {
        this.init_url = new Url(url);
    },

    start: function() {
        this.running = true;
        this.crawl(this.init_url);
    },

    stop: function() {
        this.running = false;
    },


    forEachLink: function(url,html,callback) {
        var match;
        while (match = this.reg_href.exec(html)) {
            if (match[1].substring(0,4) != 'http') 
                if (match[1].substring(0,1) == '/')
                    match[1] = url.getHost()+match[1];
                else
                    match[1] = url.getHost()+'/'+match[1];

            callback(new Url(match[1]));
        }
    },

    isCrawled: function(url) {
            var repe = false;

            this.parsed.forEach(function(u) {
                if (url.get() == u) 
                    return repe=true;
            });

            if (repe)
                return true;

            this.parsed.push(url.get());
            return false;
    },

    crawl: function(url) {
        if (this.running) {

            //Check if parsed

            if (!this.isCrawled(url)) {
                if (this.debug)
                    console.log('=> %s',url.get());

                url.getHtml(this.parseHtml.bind(this,url));
            }

        }

    },

    parseHtml: function(orig_url, ok, html) {

        if (!ok) {
            var redirect = html.headers['location'];

            if (redirect)  {
                if (redirect.substring(0,1) == '/')
                    redirect = orig_url.getProto()+'://'+orig_url.getHost()+redirect;

                if (this.debug)
                    console.log('\tredirecting to: %s',redirect);

                this.crawl(new Url(redirect));

            } else 
                if (this.debug) {
                    //console.dir(orig_url.db);
                    console.log('(%d) %s',html.statusCode,orig_url.get());
                    //console.dir(html.headers);
                }

            return;
        }

        /*
        if (this.debug)
            console.log('parsing: %s', orig_url.get());*/

        this.ee.emit('url',orig_url,html);

        this.forEachLink(orig_url, html, this.crawl.bind(this));
    },

}

exports.Crawl = Crawl;
