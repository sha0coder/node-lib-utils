// mongodb helper api
// sha0@badchecksum.net
// @sha0coder

var mongo = require('mongodb');

var Mongo = function(host) {
	this.server = new mongo.Server(host, 27017, {});
	this.db = '';
	this.oninit_callback = null;
	this.ondata_callback = null;
	this.debug = false;
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
		}
	},

	setDB: function(db) {
		this.db = db;

		new mongo.Db('local', this.server, {}).open(function (error, client) {
        		if (error) throw error;

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

	findCount: function(data) {
		this.db.find(data).count(this.handleData.bind(this));
	},

	find: function(query) {
		this.db.find(query).toArray(this.handleData.bind(this));
	},

	handleData: function(err,data) {
		if (err && this.debug)
			throw err;		
		
		if (this.ondata_callback)
			this.ondata_callback(count);
	},

	remove: function(data) {
		if (!data && this.debug) {	
			console.log('mongo.remove() no data is provided');
		} else
			this.db.remove(data);
	},

	removeAll: function() {
		this.db.remove();
	},

}

exports.Mongo = Mongo;

