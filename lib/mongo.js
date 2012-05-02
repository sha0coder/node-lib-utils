// mongodb helper api
// sha0@badchecksum.net
// @sha0coder

//TODO: profiling

var mongo = require('mongodb');
var EventEmitter = require('events').EventEmitter;

var Mongo = function(host,port) {
    this.ee = new EventEmitter();
    this.port = 27017;
    this.host = '127.0.0.1';
    
    if (host)
            this.host = host;
    if (port)
            this.port = port;
    
    this.db = null;
    this.database = '';
    this.connect();
    
    this.debug = false;
    this.profiling = false;
    this.nodata_error = 'no data';
}

Mongo.prototype = {

    setPort: function (port) {
        this.port = port;
    },
    
    setHost: function(host) {
        this.host = host;
    },
    
    connect: function() {
        this.server = new mongo.Server(this.host, this.port,{});
    },

    ready: function(error,client) {
        if (error)
            this.ee.emit('error',error);
        else { 
            this.db = new mongo.Collection(client, this.database);
            this.ee.emit('init');
        }
    },
    
    setDB: function(db) {
        this.database = db;
        console.log('seleccionando bd');
        new mongo.Db('local', this.server, {}).open(this.ready.bind(this));
    },

    close: function() {
        this.server.close();	
        this.db = null;
        this.ee.removeAllListeners();
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
        if (err)
            this.ee.emit('error',err);
        else if (data)
            this.ee.emit('data',data);
        else
            this.ee.emit('error',this.nodata_error);
    },

    remove: function(data) {
        if (data)
            this.db.remove(data);
        else
            this.ee.emit('error','mongo.remove() '+this.nodata_error);
    },

    removeAll: function() {
        this.db.remove();
    }

}

exports.Mongo = Mongo;
