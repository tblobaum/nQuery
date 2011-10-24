var _ = require('underscore'),
dnode = require('dnode'),
emitter = require('events').EventEmitter,
express = require('express'),
ejs = require('ejs'),
fs = require('fs'),
hash = require('hashish'),
nQuery = require('../'),
redis = require("redis"),
querystring = require('querystring'),
templates = {
    'item': fs.readFileSync(__dirname + '/templates/item.ejs', 'utf-8'),
    'stats': fs.readFileSync(__dirname + '/templates/stats.ejs', 'utf-8'),
    'app': fs.readFileSync(__dirname + '/templates/app.ejs', 'utf-8'),
};

var app = function (client, conn) {
    var $ = conn.$;
    
    conn.on('$', function (ready) {
        var items = [];
        var app = new emitter;
        
        app.on('load', function (x) {
            loadItems(x);
        });
        
        app.on('add', function (x) {
            addItem(x);
        });
        
        // setup app template
        $('body').append(templates.app);
        
        // handle new todo event
        $('#create-todo').live('submit', function () {
            $('#new-todo').serialize(function (data) {
                $('#new-todo').attr('value', '');
                app.emit('add', querystring.parse(data));
            });
        });
        
        // handle removing checked items
        $('#removeItems').live('click', function () {
            $('input').serialize(function (data) {
                var d = querystring.parse(data);
                removeItems(d['checked']);
            });
        });
        
        // setup id specific events
        var setupEvents = function (item) {
        
            // handle destroy even
            $('#'+ item.id + ' .todo-destroy').live('click', function () {
                removeItems(item.id);
            });
            
            // handle todo name change 
            $('#'+ item.id + ' .edit input').live('blur', function () {
                $('#'+ item.id + ' .todo').attr('class', 'todo');    
                $('#'+ item.id + ' .edit input').attr('value', function (v) {
                    item.name = v;
                    saveItem(item);
                });
            });
            
            // handle todo done change
            $('#'+ item.id + ' .display input').live('click', function () {  
                $('#'+ item.id + ' .display input').serialize(function (data) {
                    var d = querystring.parse(data);
                    if (d['checked']) {
                        item.checked = 'done';
                    } else {
                        item.checked = '';
                    }
                    saveItem(item);
                });
            });
        };
        
        // load items
        var loadItems = function (arr) {
            var j = items.length;
            arr = _.sortBy(arr, function (v) {
                return Math.abs(v.id.slice(5));
            });
            for (var i=0, l=arr.length;i<l;i++) {
                if (_.include(_.pluck(items, 'id'), arr[i].id)) {
                    renderItem(arr[i]);
                } else  {
                    items.push(arr[i]);
                    setupEvents(arr[i]);
                    renderItem(arr[i]);
                }
            }
            renderStats(arr);    
            cleanupRemoved(_.difference(_.pluck(items, 'id'), _.pluck(arr, 'id')));    
        };
        
        // add an item
        var addItem = function (item) {
            item.id = item.id || _.uniqueId('item_');
            saveItem(item);
        };
        
        // save an item
        var saveItem = function (item) {
            if (item.name) {
                db.get('items', function (err, items) {
                    var items = JSON.parse(items);
                    items = _.reject(items, function (i) {
                        return (i.id === item.id);
                    });
                    items.push(item);
                    db.set('items', JSON.stringify(items), redis.print);
                    redisPub.publish('items', JSON.stringify(items));
                });
            }
        };
        
        // remove one or an array of items
        var removeItems = function (ids) {
            db.get('items', function (err, items) {
                var items = JSON.parse(items);
                if (typeof ids !== 'undefined') {
                    if (typeof ids === 'string') {
                        ids = [].concat(ids);
                    }
                    for (var i=0, l=ids.length; i<l; i++) {
                        items = _.reject(items, function (v) { 
                            return (v.id === ids[i]);
                        });
                    }
                    db.set('items', JSON.stringify(items), redis.print);
                    redisPub.publish('items', JSON.stringify(items));
                }
            });
        };
        
        // remove items array from the dom
        var cleanupRemoved = function (arr) {
            if (arr) {
                for (var p=0, l=arr.length;p<l;p++) { 
                    $('#'+arr[p]).remove();
                }
            }
        };
        
        // render todos length, stats
        var renderStats = function (items) {
            var clear = '';
            var z = _.compact(_.pluck(items, 'checked'));
            if (z.length > 0) {
                clear = '<a href="#" id="removeItems">Remove '+z.length+' completed item(s)</a>';
            }
            $('#todo-stats').html('<span class="todo-count">'+items.length + ' items left.</span>');
            $('#todo-stats').append('<span class="todo-clear">'+clear+'</span>');
        };
        
        // render or update an item by id
        var renderItem = function (item) {
            $('#'+item['id']).index(function (y) {
                item.checked = item.checked || false;
                var html = ejs.render(templates.item, { 'locals': { 'item': item } });
                if (y >= 0) {
                    $('#'+item['id']).replaceWith(html);
                } else {
                    $('#'+item['id']).remove();
                    $('.items').append(html);
                }
            });

        };
    
        db.get('items', function (err, items) {
            app.emit('load', JSON.parse(items));
        });
            
        conn.stream = 'items';
        
        if(!pubsub.clients[conn.stream]) {
            pubsub.clients[conn.stream] = {};
        }
        
        pubsub.clients[conn.stream][conn.id] = loadItems;
        redisSub.subscribe(conn.stream);
            
        ready();
        
    });
    
};

var db = redis.createClient();
var location = 'http://localhost/?';
db.set('items', JSON.stringify([]), redis.print);

var expressApp = express.createServer();
expressApp.use(nQuery.bundle);
expressApp.use(express.static(__dirname + '/public'));
expressApp.listen(3000);

var redisPub = redis.createClient();
var redisSub = redis.createClient();
var pubsub = function (client, conn) {
        
    conn.on('end', function () {
		if (conn.stream && conn.id && pubsub.clients[conn.stream]) {
		    delete pubsub.clients[conn.stream][conn.id];
		}
		if (conn.stream) {
		    redisSub.unsubscribe(conn.stream);
		}
    });
};

pubsub.clients = {};

redisSub.on('message', function(stream, data) {
    new hash(pubsub.clients[stream]).forEach(function (emit) {
        emit.call({}, JSON.parse(data));
    });
});

dnode()
    .use(nQuery)
    .use(pubsub)
    .use(app)
    .listen(expressApp);

