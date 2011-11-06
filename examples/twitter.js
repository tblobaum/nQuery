var express = require('express');
var dnode = require('dnode');
var nQuery = require('../');
var http = require('http');
var _ = require('underscore');
var mustache = require('mustache');

var example = function ($, conn) {
    $.on('ready', function (ready) {
        var $ = conn.$;

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
                $('body').html('<h3>Twitter Search</h3>');
	            var template = '<div id="ui-app"><h4>id: {{id}}</h4><input value="node.js" /><button>Search</button><div id="ui-tweets"></div></div>';
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
        
        var app = new AppRouter({id:conn.id});
        ready();

    });
};

var expressApp = express.createServer();
expressApp.use(nQuery.middleware);
expressApp.use(express.static(__dirname + '/public'));
expressApp.listen(3000);

nQuery
    .use(example);

dnode(nQuery.middleware)
    .listen(expressApp);
    
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
