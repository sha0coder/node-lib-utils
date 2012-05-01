// mongodb helper api
// sha0@badchecksum.net
// @sha0coder

//TODO: profiling

var mongo = require('mongodb');

var Mongo = function(host,port) {
	this.port = 27017;
	this.host = '127.0.0.1';

	if (host)
		this.host = host;	
	if (port)
		this.port = port;

	this.server = new mongo.Server(this.host, this.port, {});
	this.oninit_callback = null;
	this.ondata_callback = null;
	this.onerror_callback = null;
	this.debug = false;
	this.profiling = false;
}

Mongo.prototype = {

	on: function(ev, callback) {
		switch (ev) {
			case 'init':
				this.oninit_callback = callback;
				break;
			case 'data':
				this.ondata_callback = callback;
				break;
			case 'error':
				this.onerror_callback = callback;
				break;
		}
	},

	setDB: function(db) {

		new mongo.Db('local', this.server, {}).open(function (error, client) {
        		if (error && this.onerror_callback) 
				return this.onerror_callback(error);

        		this.db = new mongo.Collection(client, db);
        		if (this.oninit_callback)
                		this.oninit_callback();
    		});
	},

	close: function() {
        	this.oninit_callback = null;
        	this.ondata_callback = null;
		this.server.close();	
		this.db = null;
	},
	
	setDebug: function(debug) {
		this.debug = debug;
	},

	insert: function(data) {
		this.db.insert(data);
	},

	count: function() {
		this.db.count(this.handleData.bind(this));		
	},

	findCount: function(data) {
		this.db.find(data).count(this.handleData.bind(this));
	},

	find: function(query) {
		this.db.find(query).toArray(this.handleData.bind(this));
	},

	handleData: function(err,data) {
		if (err && this.onerror_callback)
			return this.onerror_callback(err);	
		
		if (this.ondata_callback)
			this.ondata_callback(count);
	},

	remove: function(data) {
		if (!data && this.onerror_callback) {	
			this.onerror_callback('mongo.remove() no data is provided');
		} else
			this.db.remove(data);
	},

	removeAll: function() {
		this.db.remove();
	},

}

exports.Mongo = Mongo;

