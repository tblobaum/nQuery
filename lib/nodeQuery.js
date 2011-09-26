Hash = require('hashish');

if (typeof redis === 'undefined') {
    redis = require('redis');
}

PubSub = {};
PubSub.subs = {};
PubSub.Pub = redis.createClient();
PubSub.Sub = redis.createClient();

PubSub.Sub.on('message', function(nQstream, data) {
    try {
        var obj2 = JSON.parse(data);
    } catch (e) {
        console.log('json parsing error', e, data);
        var obj2 = data;
    } finally {
        new Hash(PubSub.subs[nQstream]).forEach(function (emit) {
            emit.call(this, obj2);
        });
    }
});

module.exports = nodeQuery = function (client, conn) {


    $ = function (context) {
        var self = this;
        
        // Gets (fn)
        
        this.get = function get(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        this.size = function size(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        this.index = function index(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        this.offset = function offset(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        this.height = function height(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };

        this.width = function width(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        
        // Live binding (string, callback)
        
        this.live = function live() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        this.bind = function bind() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        this.unbind = function unbind() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        
        // Sets (string, [function])
        
        this.html = function html(fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn !== 'function') {
                execute({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            } else {
                client.nQhtml({
                    context:context, 
                    fn:arguments.callee.name,
                }, fn);
            }
        };
        
        this.text = function text(fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn !== 'function') {
                execute({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            } else {
                client.nQtext({
                    context:context, 
                    fn:arguments.callee.name,
                }, fn);
            }
        };
        
        this.attr = function attr(attr, fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:attr
                }, fn);
            } else {
                execute({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            }
        };

        this.css = function css(attr, fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:attr
                }, fn);
            } else {
                execute({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            }
        };

        

     
        
        this.addClass = function addClass() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        this.removeClass = function removeClass() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
     
        
        this.remove = function remove() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        
        
        // Sets (string)
        
        this.append = function append() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        this.prepend = function prepend() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        this.before = function before() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
       };
        
        this.after = function after() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });   
            return self;     
        };
        
        this.appendTo = function appendTo(params) {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });     
            return self;   
        };
        
        this.prependTo = function prependTo(params) {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });     
            return self;   
        };
        
        
        // Sets (no parameters)
        
        this.show = function show() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name,
                args:args
            });
            return self;
        };
        
        this.hide = function hide() {
            var args = Array.prototype.slice.call(arguments);
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        // Execute pubsub
        
        function execute(res) {
            res.nQstream = conn.nQstream;
            try {
                res = JSON.stringify(res);
            } catch (e) {
                console.log('stringify json:', e, res);
            } finally {
                PubSub.Pub.publish(conn.nQstream, res);
            }
        }

        return this;
    };
    
    this.nodeQuery = function (context, callback) {
        context = context || '';
        conn.nQstream = '$' + conn.id + context;
        if(!PubSub.subs[conn.nQstream]) PubSub.subs[conn.nQstream] = {};
        PubSub.subs[conn.nQstream][conn.id] = callback;
        PubSub.Sub.subscribe(conn.nQstream);
        conn.emit('$');
    };
    
    conn.on('end', function () {
        console.log('Ending conn.nQstream:' + conn.nQstream);
		if (conn.nQstream && conn.id && PubSub.subs[conn.nQstream]) delete PubSub.subs[conn.nQstream][conn.id];
		if (conn.nQstream) PubSub.Sub.unsubscribe(conn.nQstream);
    });

};

nodeQuery.path = __dirname + '/browser-nodeQuery.js';

