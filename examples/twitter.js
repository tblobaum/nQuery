var dnode          = require('dnode');
var browserify     = require('browserify');
var express        = require('express');
var http           = require('http');
var redis          = require('redis');
var nodeQuery      = require('../');
nQpath             = nodeQuery.path;
var _              = require('underscore');
var mustache       = require('mustache');

example = function (client, conn) {
    conn.on('$', function () {

        var AppModel = Minibone.Model.extend({
            initialize: function(params) {
                this.tweets = [];
            },
        });
        
        var AppView = Minibone.View.extend({
            id: 'ui-app',
            initialize: function(params) {
                this.model = params.model;
                $('button').live('click', function () {
                    $('input').attr('value', function (val) {
                        app.view.removeTweets();
                        app.view.poll(val);
                    });
                });
            },
            
            render: function () {
                $('body').html('<h2>Twitter Search</h2>');
	            var template = '<div id="ui-app"><input value="node.js" /><button>Search</button><div id="ui-tweets"></div></div>';
	            this.el = mustache.to_html(template, this.model.attributes);
	            return this;
            },
            
            addTweet: function (tweet) {                
	            var template = '<div class="ui-tweet" style="margin:10px;"><p><strong>@{{from_user}}: </strong>{{text}}</p></div>';
	            var content = mustache.to_html(template, tweet);
	            $('#ui-tweets').append(content);
            },
            
            removeTweets: function (opts) {
                $('#ui-tweets').html(' ');
            },
            
            poll: function (val) {
                var options = {
                    host: 'search.twitter.com',
                    port: 80,
                    path: '/search.json?q='+val+'&result_type=mixed&rpp=50&lang=en'
                };
                console.log('Polling Twitter');
                var req = http.get(options, function(res) {
                    var data = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', function () {
                        try { 
                            tweets = JSON.parse(data);
                        } catch (e) { 
                            console.log(e);
                            tweets = [];
                        } finally {
                            for (var i=0, l=tweets.results.length; i<l; i++) {
                                app.view.addTweet(tweets.results[i]);
                            }
                        }
                    });
                });
                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                });
                req.end();
            }
        });

        var AppRouter = Minibone.Router.extend({
            initialize: function(params) {
	            this.model = new AppModel(params);
	            this.view = new AppView({'model': this.model});
	            $('body').append(this.view.render().el);
            },
        });
        
        var app = new AppRouter();

    });
};

app = express.createServer();

var bundle = browserify({
    'entry': nQpath,
    'require': ['dnode'],
    'filter': require('uglify-js'),
    'mount': '/nodeQuery.js',
});

app.use(bundle);
app.use(express.static(__dirname + '/public'));
app.listen(3000);

dnode()
    .use(example)
    .use(nodeQuery)
    .listen(app);
    
var Minibone = {
    Model: {
        extend: function (options) {
            this.initialize = function () {};
            this.add = function () {};
            this.remove = function () {};
            var fn = _.extend(this, options);
            return (function () {
                _.extend(this, fn);
                this.attributes = arguments[0];
                this.initialize.apply(this, arguments);
            });
        },
    },
       
    View: {
        extend: function (options) {
            this.initialize = function () {};
            this.add = function () {};
            this.remove = function () {};
            var fn = _.extend(this, options);
            return (function () {
                _.extend(this, fn);
                this.initialize.apply(this, arguments);
            });
        },
    },
    
    Router: {
        extend: function (options) {
            this.initialize = function () {};
            this.add = function () {};
            this.remove = function () {};
            var fn = _.extend(this, options);
            return (function () {
                _.extend(this, fn);
                this.initialize.apply(this, arguments);
            });
        },
    },
};
