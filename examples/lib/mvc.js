// Simple MVC framework 
// - redis pubsub built in
// - automatically loads views
// - automatically loads view rendering engine

var _ = require('underscore'),
emitter = require('events').EventEmitter,
fs = require('fs'),
hash = require('hashish'),
redis = require('redis');

var walk = function(dir, done) {
    var results = {};
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        list.forEach(function(file) {  
          file = dir + '/' + file;     
          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              walk(file, function(err, res) {
                var key = file.replace(/^.*\//, '');
                _.extend(results, res);
                if (!--pending) done(null, results);
              });
            } else {
              var str = fs.readFileSync(file, 'utf-8');
              var key = file.replace(/^.*\//, '');
              key = key.match(/(.*)\.[^.]+$/);
              key = key[1];
              results[key] = str;
              if (!--pending) done(null, results);
            }
          });
        });
    });
};

exports.database = 'memory';
exports.templates = [];
exports['template engine'] = 'mustache';

exports.set = function () {
    if (typeof arguments[0] !== 'string') return;
    var key = arguments[0];
    var value = arguments[1];
    var params = arguments[2];
    switch (key) {
    
        case 'database':
            console.log('setting database', value);
            exports.database = value;
            exports.db = require(value);
            if (value === 'redis') exports.db = exports.db.createClient();
            if (value === 'mongodb') exports.db = exports.db.connect();
        break;
        
        case 'template engine':
            console.log('setting template engine', value);
            exports['template engine'] = value;
            exports[value] = require(value);
            exports.render = exports[value].render;
        break;
        
        case 'templates directory':
            console.log('setting templates directory', value);
            var dir = arguments[1] || 'views';
            walk('./' + dir, function (e, tpls) {
                if (exports.debug) console.log('Loaded ' + Object.keys(tpls).length + ' views from ' + dir);
                templates = tpls;
            });
        break;
        
    }
};

exports.middleware = pubsub = function (client, conn) {
    conn.on('end', function () {
		
		if (conn.stream && conn.id && exports.middleware.clients[conn.stream]) {
		    delete exports.middleware.clients[conn.stream][conn.id];
		}
		
		if (conn.stream) {
		    redisSub.unsubscribe(conn.stream);
		}
		
    });
};

exports.middleware.clients = {};
exports.redisPub = redisPub = redis.createClient();
exports.redisSub = redisSub = redis.createClient();

redisSub.on('message', function(stream, data) {
    new hash(exports.middleware.clients[stream]).forEach(function (emit) {
        emit.call({}, JSON.parse(data));
    });
});

exports.bind = function (conn, model) {
    if(!exports.middleware.clients[conn.stream]) {
        exports.middleware.clients[conn.stream] = {};
    }

    exports.middleware.clients[conn.stream][conn.id] = model.sync;
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
            exports.db.get(self.modelName, function (e, docs) {
                docs = JSON.parse(docs); 
                docs.push(doc);
                docs = JSON.stringify(docs);
                exports.db.set(self.modelName, docs, function (e) {
                    self.emit('add', doc);
                    redisPub.publish(self.modelName, docs);
                });
            });
        },
        
        read: function (fn) {
            exports.db.get(self.modelName, function (e, docs) {
                fn(JSON.parse(docs));
            });
        },
        
        update: function (doc) {
            if (!doc.name) return;
            exports.db.get(self.modelName, function (e, docs) {
                docs = _.reject(JSON.parse(docs), function (itm) {
                    return (itm.id === doc.id);
                });
                docs.push(doc);
                docs = JSON.stringify(docs);
                exports.db.set(self.modelName, docs, function (e) {
                    self.emit('change', doc);
                    redisPub.publish(self.modelName, docs);
                });
            });
        },
        
        remove: function (ids) {
            exports.db.get(self.modelName, function (err, docs) {
                if (typeof ids === 'undefined') return;
                if (typeof ids === 'string') ids = [].concat(ids);
                self.emit('remove', ids);
                docs = _.filter(JSON.parse(docs), function (itm) { 
                    if (_.indexOf(ids, itm.id) < 0) return true;
                    else return false;
                });
                docs = JSON.stringify(docs);
                exports.db.set(self.modelName, docs);
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
                    self.initialize && self.initialize(newdocs[i]);
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
    var self = this;
    _.extend(this, params, new emitter, {
        'templates': templates
    });
    this.initialize && this.initialize(this);
    this.emit('initialize', this);
};

exports.View.Extend = function (params) {
    _.extend(exports.View.prototype, params);
    return _.bind(exports.View, params, params);
};

exports.Controller = function (params) {        
    _.extend(this, params, new emitter);
    this.initialize && this.initialize(this);
    this.emit('initialize', this);
};

exports.Controller.Extend = function (params) {
    params = params || {};
    _.extend(exports.Controller.prototype, params);
    return _.bind(exports.Controller, params, params);
};

