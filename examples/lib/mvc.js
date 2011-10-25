var _ = require('underscore'),
emitter = require('events').EventEmitter,
fs = require('fs'),
hash = require('hashish'),
redis = require("redis"),
mustache = require('mustache'),
ejs = require('ejs');

exports.set = function () {
    if (typeof arguments[0] !== 'string') return;
    if (arguments[0] === 'templates') {
    
    }
};


exports.pubsub = pubsub = function (client, conn) {
    conn.on('end', function () {
		if (conn.stream && conn.id && pubsub.clients[conn.stream]) delete pubsub.clients[conn.stream][conn.id];
		if (conn.stream) redisSub.unsubscribe(conn.stream);
    });
};

exports.pubsub.clients = {};

exports.db = db = redis.createClient();
exports.redisPub = redisPub = redis.createClient();
exports.redisSub = redisSub = redis.createClient();

redisSub.on('message', function(stream, data) {
    new hash(exports.pubsub.clients[stream]).forEach(function (emit) {
        emit.call({}, JSON.parse(data));
    });
});

exports.bind = function (conn, model) {
    if(!exports.pubsub.clients[conn.stream]) {
        exports.pubsub.clients[conn.stream] = {};
    }

    exports.pubsub.clients[conn.stream][conn.id] = model.sync;
    exports.redisSub.subscribe(conn.stream);
};

exports.Model = function (params) {
    params = params || {};
    this.modelName = params.model || '';
    this.property = params.model + '_';
    this.collection = [];
    var self = this;   
    
    _.extend(this, new emitter, {
        add: function (doc) {
            self.create(doc);
        },
        create: function (doc) {
            doc.id = doc.id || _.uniqueId(self.property);
            if (!doc.name) return;
            db.get(self.modelName, function (e, docs) {
                docs = JSON.parse(docs); 
                docs.push(doc);
                docs = JSON.stringify(docs);
                db.set(self.modelName, docs, function (e) {
                    self.emit('add', doc);
                    redisPub.publish(self.modelName, docs);
                });
            });
        },
        read: function (fn) {
            db.get(self.modelName, function (e, docs) {
                fn(JSON.parse(docs));
            });
        },
        update: function (doc) {
            if (!doc.name) return;
            db.get(self.modelName, function (e, docs) {
                docs = _.reject(JSON.parse(docs), function (itm) {
                    return (itm.id === doc.id);
                });
                docs.push(doc);
                docs = JSON.stringify(docs);
                db.set(self.modelName, docs, function (e) {
                   redisPub.publish(self.modelName, docs);
                });
            });
        },
        remove: function (ids) {
            db.get(self.modelName, function (err, docs) {
                if (typeof ids === 'undefined') return;
                if (typeof ids === 'string') ids = [].concat(ids);
                docs = _.filter(JSON.parse(docs), function (itm) { 
                    if (_.indexOf(ids, itm.id) < 0) return true;
                    else return false;
                });
                docs = JSON.stringify(docs);
                db.set(self.modelName, docs);
                redisPub.publish(self.modelName, docs);
            });
        },
        comparator: function (docs) {
            return _.sortBy(docs, function (v) {
                return Math.abs(v.id.slice(self.modelName.length+1));
            });
        },
        sync: function (newdocs) {
            if (!newdocs) return;
            newdocs = self.comparator(newdocs);
            for (var i=0, l=newdocs.length;i<l;i++) {
                if (!_.include(_.pluck(self.collection, 'id'), newdocs[i].id)) {
                    self.collection.push(newdocs[i]);
                    self.emit('initialize', newdocs[i]);
                    self.initialize(newdocs[i]);
                }
            }
            self.emit('sync', newdocs);
        }
    });
    
};

exports.Model.Extend = function (params) {
    _.extend(exports.Model.prototype, params);
    return _.bind(exports.Model, params, params);
};

exports.View = function (params) {
    params = params || {};
    this.Html = [];
    var dir = process.env.PWD;
    var prefix = '/templates';
    var self = this;
    _.extend(this, params, new emitter, {
        templates: {
            'item': fs.readFileSync(dir + prefix + '/item.ejs', 'utf-8'),
            'stats': fs.readFileSync(dir + prefix + '/stats.ejs', 'utf-8'),
            'app': fs.readFileSync(dir + prefix + '/app.ejs', 'utf-8'),
        }
    });
    this.initialize(this);
    this.emit('initialize', this);
};

exports.View.Extend = function (params) {
    _.extend(exports.View.prototype, params);
    return _.bind(exports.View, params, params);
};

exports.Controller = function (params) {        
    _.extend(this, params, new emitter);
    this.initialize(this);
    this.emit('initialize', this);
};

exports.Controller.Extend = function (params) {
    params = params || {};
    _.extend(exports.Controller.prototype, params);
    return _.bind(exports.Controller, params, params);
};


