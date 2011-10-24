var Browserify = require('browserify');

module.exports = function (client, conn) {

    conn.$ = function (context) {
        var self = conn;
        
        // Gets (fn)
        conn.get = function get(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        conn.size = function size(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        conn.index = function index(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        conn.offset = function offset(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        conn.height = function height(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        conn.width = function width(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        conn.serialize = function serialize(fn) {
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:''
                }, fn);
            }
        };
        
        // Live binding (string, callback)
        conn.live = function live() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        conn.bind = function bind() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        conn.unbind = function unbind() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        
        // Sets (string, [function])
        conn.html = function html(fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn !== 'function') {
                client.nQset({
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
        conn.text = function text(fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn !== 'function') {
                client.nQset({
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
        conn.attr = function attr(attr, fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:attr
                }, fn);
            } else {
                client.nQset({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            }
        };
        conn.css = function css(attr, fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:attr
                }, fn);
            } else {
                client.nQset({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            }
        };
        conn.toggleClass = function toggleClass(attr, fn) {
            var args = Array.prototype.slice.call(arguments);
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:attr
                }, fn);
            } else {
                client.nQset({
                    context:context, 
                    fn:arguments.callee.name, 
                    args:args
                });
                return self;
            }
        };
        conn.addClass = function addClass() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        conn.removeClass = function removeClass() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        // Sets (string)
        conn.replaceWith = function replaceWith() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        conn.append = function append() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        conn.prepend = function prepend() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        conn.before = function before() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        conn.after = function after() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });   
            return self;     
        };
        conn.appendTo = function appendTo(params) {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });     
            return self;   
        };
        conn.prependTo = function prependTo(params) {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });     
            return self;   
        };
        
        
        // Sets (no parameters)
        conn.show = function show() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name,
                args:args
            });
            return self;
        };
        conn.hide = function hide() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        conn.remove = function remove() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };

        return self;
    };
    
    this.nodeQuery = function (context, callback) {
        context = context || '';
        conn.nQstream = '$' + conn.id + context;
        conn.emit('$', callback);
    };
    
    conn.on('end', function () {
        console.log('Ending conn.nQstream:' + conn.nQstream);
    });

};

module.exports.entryPath = __dirname + '/browser-nodeQuery.js';

module.exports.bundle = Browserify({
    'entry': module.exports.entryPath,
    'require': ['dnode'],
    'mount': '/nquery.js',
});

