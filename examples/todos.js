var _ = require('underscore'),
dnode = require('dnode')(),
ejs = require('ejs'),
Express = require('express'),
nQuery = require('../'),
Framework = require('./lib/mvc.js');
Framework.set('database', 'redis');
Framework.set('templates directory', 'templates');
Framework.set('template engine', 'ejs');

nQuery.debug = true;
Framework.debug = true;

var todosApp = function (client, conn) {
    var $ = conn.$;
    conn.stream = 'items';
    var app, 
        model, 
        view;
    
    var ItemsModel = Framework.Model.Extend({
        model: 'items',
        initialize: function (params) {
            console.log('ItemsModel init');
        }
    });
    
    var ItemsView = Framework.View.Extend({
        initialize: function (params) {
            console.log('ItemsView init');
        }
    });
    
    var ItemsController = Framework.Controller.Extend({
        initialize: function (params) {
            console.log('ItemsController init');
        }
    });
    
    var AppModel = Framework.Controller.Extend({
        initialize: function (params) {
            console.log('AppModel init');
            this.items = new ItemsModel();
        }
    });
    
    var AppView = Framework.View.Extend({
        el: $('#todoapp'),
        initialize: function (params) {
            console.log('AppView init');
            this.Html = [];
            this.items = new ItemsView();
            
            $('body').append(this.templates.app);
            
            // handle new todo event
            $('#create-todo').live('submit', function () {
                $('#new-todo').serialize(function (data) {
                    model.items.add($.parseQuerystring(data))
                });
                $('#new-todo').attr('value', '');
            });
            
            // handle removing checked items
            $('#removeItems').live('click', function () {
                $('input').serialize(function (data) {
                    var d = $.parseQuerystring(data);
                    model.items.remove(d['checked']);
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
            var html = Framework.render(this.templates.item, { 'locals': { 'item': item } });
            if (this.Html[item.id] && this.Html[item.id] !== html) {
                $('#'+item.id).replaceWith(html);
            } else if (!this.Html[item.id]) {
                $('.items').prepend(html); 
            }
            this.Html[item.id] = html;
        },
    });
    
    var AppController = Framework.Controller.Extend({
        initialize: function (params) {
            console.log('AppController init');
            this.items = new ItemsController();
        }
    });
    
    conn.on('$', function (ready) {
    
        app = new AppController();
        model = new AppModel();
        view = new AppView();

        model.items.on('initialize', function (item) {
        
            // handle todo destroy
            $('#'+ item.id + ' .todo-destroy').live('click', function () {
                model.items.remove(item.id);
            });
            
            // handle todo name edit 
            $('#'+ item.id + ' .edit input').live('blur', function () {
                $('#'+ item.id + ' .todo').removeClass('editing');    
                $('#'+ item.id + ' .edit input').attr('value', function (v) {
                    item.name = v;
                    model.items.update(item);
                });
            });
            
            // handle todo checkbox
            $('#'+ item.id + ' .display input').live('click', function () {  
                $('#'+ item.id + ' .display input').serialize(function (data) {
                    var d = $.parseQuerystring(data);
                    if (d['checked']) item.checked = 'done';
                    else item.checked = '';
                    model.items.update(item);
                });
            }); 
            
        });
        
        model.items.on('sync', function (newdocs) {
            view.renderItems(newdocs);
            var removedIds = _.difference(_.pluck(model.items.collection, 'id'), _.pluck(newdocs, 'id'));
            view.cleanupRemoved(removedIds);
        });
        
        Framework.bind(conn, model.items);
        model.items.read(model.items.sync);
        ready();
        
    });
};

var express = Express.createServer();

express
    .use(nQuery.bundle)
    .use(Express.static(__dirname + '/public'))
    .use(function (req, res, next) {
        res.redirect('/');
    })
    .listen(3000);

dnode
    .use(nQuery)
    .use(Framework.middleware)
    .use(todosApp)
    .listen(express);

