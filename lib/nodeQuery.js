Hash = require('hashish');

if (typeof redis === 'undefined') {
    redis = require('redis');
}

PubSub = {};
PubSub.subs = {};
PubSub.Pub = redis.createClient();
PubSub.Sub = redis.createClient();

PubSub.Sub.on('message', function(stream, data) {
    try {
        var obj2 = JSON.parse(data);
    } catch (e) {
        console.log('json parsing error', e, data);
        var obj2 = data;
    } finally {
        new Hash(PubSub.subs[stream]).forEach(function (emit) {
            emit.call(this, obj2);
        });
    }
});

module.exports = nodeQuery = function (client, conn) {
    $ = function (context) {
        
        this.html = function html() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        this.text = function text() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        this.append = function append() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        this.prepend = function prepend() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        this.before = function before() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
       };
        
        this.after = function after() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });        
        };
        
        this.appendTo = function appendTo(params) {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });        
        };
        
        this.prependTo = function prependTo(params) {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });        
        };
        
        this.show = function show() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name,
                args:args
            });
        };
        
        this.hide = function hide() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        this.attr = function attr() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        this.css = function css() {
            var args = Array.prototype.slice.call(arguments);
            arguments.callee.name && arguments.callee.name.toString();
            execute({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
        };
        
        function execute(res) {
            res.stream = conn.stream;
            PubSub.Pub.publish(conn.stream, JSON.stringify(res));
        }

        return this;
    };
    
    this.nodeQuery = function (context, callback) {
        context = context || '';
        conn.stream = '$' + conn.id + context;
        if(!PubSub.subs[conn.stream]) PubSub.subs[conn.stream] = {};
        PubSub.subs[conn.stream][conn.id] = callback;
        PubSub.Sub.subscribe(conn.stream);
        conn.emit('$');
    };
    
    conn.on('end', function () {
        console.log('Ending conn.stream:' + conn.stream);
		if (conn.stream && conn.id && PubSub.subs[conn.stream]) delete PubSub.subs[conn.stream][conn.id];
		if (conn.stream) PubSub.Sub.unsubscribe(conn.stream);
    });

};

nodeQuery.path = __dirname + '/browser-nodeQuery.js';

