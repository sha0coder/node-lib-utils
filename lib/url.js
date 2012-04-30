var http = require('http'),
    https = require('https');



var Url = function (url) {
	this.clear();
    this.reg_href = /href *= *"?'?([^>]*)"?'?/ig;
    this.redirect = null;
	
	if (url) 
		this.set(url);
}


Url.prototype = {
	
	clear: function () {
		this.db = {
			url:'',
			proto:'',
			ssl:false,
			host:'',
			port:80,
			path:'/',
			file:'',
			get:'', 
			post:'',
			method:'GET',
		};
        this.redirect = null;
	},

    getHost: function() {
        return this.db['host'];
    },

    getProto: function() {
        return this.db['proto'];
    },

    getPath: function() {
        return this.db['path'];
    },

    getMethod: function() {
        return this.db['method'];
    },

    setFollowRedirects: function(bool) {
        this.follow_redirects = bool;
    },
	
	disp: function() {
		console.log(this.db);
	},

	get: function() {
		return this.db['url'];
	},

	set: function(url) {
        if (url)
		    this.set(url,null);
	},

	set: function(url,post) {
		if (!url)
			return;

        this.clear();
		
		url = this.fix(url);	

		this.clear();
		try {
			var spl = url.split('/');

			this.db['url'] = url;
			if (post) {
				this.db['post'] = post;
				this.db['method'] = 'POST';
			}
	
			var proto = spl.shift(); spl.shift();		//   [http:,,www.aa.com,path1,path2,file?params] 
			proto = proto.substring(0,proto.length-1);
			this.db['proto'] = proto;			        //   [www.aa.com,path1,path2,file?params] 

			var host = spl.shift().split('?').shift();

			var port = host.split(':');
			if (port.length > 1) {
				host = port[0];
				this.db['port'] = port[1];
			} 

			this.db['host'] = host;

			if (this.db['proto'] == 'https') 
				this.db['ssl'] = true;
			
			var rest = spl.pop();				// rest = file?params
			this.db['path'] = '/'+spl.join('/')+'/';				

            if (rest) {
			    spl = rest.split('?');
			    if (spl.length>0) 
				    this.db['get'] = spl.pop();
			    if (spl.length>0)
				    this.db['file'] = spl.pop();
            }
			
			
		} catch (e) {
            throw e;
			//console.log('err '+e);
		}	
	},

	fix: function(url) {
		url = url.replace('\n|\r','');
		if (url.substring(0,4) != 'http') 
			url = 'http://'+url;
		return url;
	},

    forEachLink: function(html, callback) {
        var match;
        while (match = this.reg_href.exec(html)) {
            callback(new Url(match[1]));
        }
    },

    handleResponse: function(callback,resp) {
        switch (resp.statusCode) {
            case 200:
                var html = '';
                resp.setEncoding('utf8');

                resp.on('data', function(htm) {
                    html += htm;
                });
                resp.on('end', function() {
                    callback(true,html);
                });
                break;

            /*
            case 301:
            case 302:
            case 307:
                    this.redirect = resp.headers['location'];
                    callback(false, resp);
                    break;*/

            default:
                callback(false, resp);
        }

    },

	getHtml: function(callback) {
		var opts = {
			port: this.db['port'],
			host: this.db['host'],
			path: this.db['path']+this.db['file']+'?'+this.db['get'],
			method: this.db['method'],
		};		

        this.redirect = null;

        var req;

		if (this.db['ssl']) 
		    req = https.request(opts, this.handleResponse.bind(this,callback));
        else
            req = http.request(opts, this.handleResponse.bind(this,callback));
        
	    req.on('error', this.error.bind(this));
        req.end();

	},

    error: function(e) {
		console.log(this.get()+' '+e);
        //console.dir(this.db);
    },


}

exports.Url = Url;

