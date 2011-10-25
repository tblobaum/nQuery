var _ = require('underscore'),
dnode = require('dnode')(),
ejs = require('ejs'),
Express = require('express'),
filesystem = require('fs'),
nQuery = require('../'),
querystring = require('querystring'),
Spartan = require('./lib/mvc.js'),
home = filesystem.readFileSync(__dirname + '/public/index.html', 'utf-8');

Spartan.set('templates', '/templates');

var dnodeApp = function (client, conn) {
    conn.stream = 'items';
    var $ = conn.$, 
        app, 
        model, 
        view;
    
    var AppModel = Spartan.Model.Extend({
        model: 'items', 
        initialize: function (params) {
            console.log('model init');
        }
    });
    
    var AppView = Spartan.View.Extend({
        initialize: function (params) {
            $('body').append(params.templates.app);
            
            // handle new todo event
            $('#create-todo').live('submit', function () {
                $('#new-todo').serialize(function (data) {
                    model.add(querystring.parse(data))
                });
                $('#new-todo').attr('value', '');
            });
            
            // handle removing checked items
            $('#removeItems').live('click', function () {
                $('input').serialize(function (data) {
                    var d = querystring.parse(data);
                    model.remove(d['checked']);
                });
            });
            
        },
        cleanupRemoved: function (arr) {
            if (!arr) return;
            for (var p=0, l=arr.length;p<l;p++) $('#'+arr[p]).remove();
        },
        renderItems: function (items) {
            var str = '';
            var chkd = _.compact(_.pluck(items, 'checked'));
            if (chkd.length > 0) {
                str = '<a href="#" id="removeItems">Remove '+
                chkd.length+' completed item(s)</a>';
            }
            $('#todo-stats').html('<span class="todo-count">'+
                items.length + ' items left.</span>'+
                '<span class="todo-clear">'+str+'</span>');
                
            for (var k in items) {
                this.renderItem(items[k]);
            }
        },
        renderItem: function (item) {
            item.checked = item.checked || false;
            var html = ejs.render(this.templates.item, { 'locals': { 'item': item } });
            if (this.Html[item.id] && this.Html[item.id] !== html) {
                $('#'+item.id).replaceWith(html);
            } else if (!this.Html[item.id]) {
                $('.items').prepend(html); 
            }
            this.Html[item.id] = html;
        },
    });
    
    var AppController = Spartan.Controller.Extend({
        initialize: function (params) {
            console.log('controller init');
        }
    });
    
    conn.on('$', function (ready) {
    
        app = new AppController();
        model = new AppModel();
        view = new AppView();
        
        model.on('initialize', function (item) {
            // handle destroy event
            $('#'+ item.id + ' .todo-destroy').live('click', function () {
                model.remove(item.id);
            });
            
            // handle todo name change 
            $('#'+ item.id + ' .edit input').live('blur', function () {
                $('#'+ item.id + ' .todo').removeClass('editing');    
                $('#'+ item.id + ' .edit input').attr('value', function (v) {
                    item.name = v;
                    model.update(item);
                });
            });
            
            // handle todo done change
            $('#'+ item.id + ' .display input').live('click', function () {  
                $('#'+ item.id + ' .display input').serialize(function (data) {
                    var d = querystring.parse(data);
                    if (d['checked']) item.checked = 'done';
                    else item.checked = '';
                    model.update(item);
                });
            }); 
        });
        
        model.on('sync', function (newdocs) {
            view.renderItems(newdocs);
            var removedIds = _.difference(_.pluck(model.collection, 'id'), _.pluck(newdocs, 'id'));
            view.cleanupRemoved(removedIds);
        });
        
        Spartan.bind(conn, model);
        model.read(model.sync);
        ready();
        
    });
};

var express = Express.createServer();

express
    .use(nQuery.bundle)
    .use(Express.static(__dirname + '/public'))
    .use(function (req, res, next) {
        res.end(home);
    })
    .listen(3000);

dnode
    .use(nQuery)
    .use(Spartan.pubsub)
    .use(dnodeApp)
    .listen(express);

