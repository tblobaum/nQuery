var url = require('url')
    , _ = require('underscore')
    , qs = require('querystring')
    , fs = require('fs')
    , middleware = require('./middleware')
    , EventEmitter = require('events').EventEmitter;
    
function nQuery ($, connection, client) {

    var _methods = [
      'get',
      'size',
      'index',
      'offset',
      'height',
      'width',
      'serialize',
      'live',
      'bind',
      'unbind',
      'html',
      'text',
      'attr',
      'css',
      'toggleClass',
      'addClass',
      'removeClass',
      'replaceWith',
      'append',
      'prepend',
      'before',
      'after',
      'prependTo',
      'appendTo',
      'show',
      'hide',
      'remove',
      'parseQuerystring',
      'stringifyQuerystring'
    ];

    connection.$ = function (context) {
    
        this.context = context;
        var self = this;
        _.extend(self, connection);
        
        self.get = function get(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        self.size = function size(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        self.index = function index(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        self.offset = function offset(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        self.height = function height(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        self.width = function width(fn) {
            client.nQget({
                context:context, 
                fn:arguments.callee.name,
            }, fn);
        };
        
        self.serialize = function serialize(fn) {
            if (typeof fn === 'function') {
                client.nQattr({
                    context:context, 
                    fn:arguments.callee.name,
                    args:''
                }, fn);
            }
        };
        
        // Live binding (string, callback)
        self.live = function live() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        self.bind = function bind() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        self.unbind = function unbind() {
            var args = Array.prototype.slice.call(arguments);
            client.nQlive({
                context:context, 
                fn:arguments.callee.name,
                args:args[0]
            }, args[1]);
        };
        
        
        // Sets (string, [function])
        self.html = function html(fn) {
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
        
        self.text = function text(fn) {
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
        
        self.attr = function attr(attr, fn) {
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
        
        self.css = function css(attr, fn) {
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
        
        self.toggleClass = function toggleClass(attr, fn) {
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
        
        self.addClass = function addClass() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.removeClass = function removeClass() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        // Sets (string)
        self.replaceWith = function replaceWith() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.append = function append() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.prepend = function prepend() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.before = function before() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.after = function after() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });   
            return self;     
        };
        
        self.appendTo = function appendTo(params) {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });     
            return self;   
        };
        
        self.prependTo = function prependTo(params) {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });     
            return self;   
        };
        
        
        // Sets (no parameters)
        self.show = function show() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name,
                args:args
            });
            return self;
        };
        
        self.hide = function hide() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.remove = function remove() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };
        
        self.preventDefault = function preventDefault() {
            var args = Array.prototype.slice.call(arguments);
            client.nQset({
                context:context, 
                fn:arguments.callee.name, 
                args:args
            });
            return self;
        };

        if (nQuery.debug) console.log(connection.nQstream, context );
        return self;
    };

     connection.$ =    _.extend(connection.$, new EventEmitter);
    // Utility functions (no RPC)

    connection.$.parseQuerystring = function (str) {
        return qs.parse(str);
    };
    
    connection.$.stringifyQuerystring = function (obj) {
        return qs.stringify(obj);
    };
        
    this.nodeQuery = function (location, isReady) {
        var nQurl = url.parse(location);
        connection.nQhref = location;
        connection.isReady = isReady;
        connection.nQpath = nQurl.pathname;
        connection.nQstream = '$' + connection.id + ' ' + connection.nQpath;
        
        connection.$.emit(connection.nQpath, isReady);
        connection.$.emit('ready', isReady);
        
        if (nQuery.debug) console.log(connection.nQstream,'route:',connection.nQpath);
    };

};

nQuery.middleware = middleware;
if (!nQuery.debug) nQuery.middleware.filter = require('uglify-js');
nQuery.middleware.fns = [];

nQuery.use = function (fn) {
    nQuery.middleware.fns.push(fn);
    return nQuery;
};

nQuery.use(nQuery);

var file = fs.readFileSync(__dirname + '/../templates/index.ejs', 'utf-8');

nQuery.static = function (req, res, next) {
    res.end(file)
}

module.exports = nQuery;

