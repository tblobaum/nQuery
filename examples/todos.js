var _ = require('underscore'),
dnode = require('dnode')(),
Express = require('express'),
nQuery = require('../'),
Tube = require('tubes');
//Tube.set('database', 'redis', [ 9470, 'nodejitsu:37b9aef8dd751c61f2589b7aa1b10609@perch.redistogo.com']);
Tube.set('database', 'redis', [ 6379, '127.0.0.1']);
Tube.set('templates directory', 'views');
Tube.set('template engine', 'ejs');
Tube.db.set('items', JSON.stringify([]) );
Tube.debug = true;
nQuery.debug = false;

var todosApp = function (client, conn) {
    var app, 
    $ = conn.$;
    
    var ItemsModel = Tube.Model.extend({
        model: 'items',
        initialize: function (item) {
        }
    });

    var ItemsView = Tube.View.extend({
        initialize: function (params) {
        },
        render: function (params) {
            
            // handle adding new todo
            $('#create-todo').live('submit', function () {
                $('#new-todo').serialize(function (data) {
                    params.model.create($.parseQuerystring(data));
                });
                $('#new-todo').attr('value', '');
            });
            
            // handle removing checked items
            $('#removeItems').live('click', function () {
                $('input').serialize(function (data) {
                    var d = $.parseQuerystring(data);
                    params.model.remove(d['checked']);
                });
            });
        },
        addItem: function (item, model) {
            
            // handle todo destroy
            $('#'+ item.id + ' .todo-destroy').live('click', function () {
                model.remove(item.id);
            });
            var str = '';
     
            
            // handle todo name edit 
            $('#'+ item.id + ' .edit input').live('blur', function () {
                $('#'+ item.id + ' .todo').removeClass('editing');    
                $('#'+ item.id + ' .edit input').attr('value', function (v) {
                    item.name = v;
                    model.update(item);
                });
            });
            
            // handle todo checkbox
            $('#'+ item.id + ' .display input').live('click', function () {  
                $('#'+ item.id + ' .display input').serialize(function (data) {
                    var d = $.parseQuerystring(data);
                    if (d['checked']) item.checked = 'done';
                    else item.checked = '';
                    model.update(item);
                });
            });
        },
        
        renderItems: function (items) {
            var str = '';
            var chkd = _.pluck(items, 'checked');
            chkd = _.compact(chkd);
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
            var html = Tube.render(this.templates.item, { 
                locals: { 
                    item: item 
                }
            });
            
            $('#'+item.id).replaceWith(html);
        }
    });

    var ItemsController = Tube.Controller.extend({
        initialize: function (params) {
            var self = this;    
            this.model = new ItemsModel();
            this.view = new ItemsView();
            
            self.model.on('initialize', function (item) {
                $('#todo-list').prepend('<li id="'+item.id+'" > </li>');
                self.view.addItem(item, self.model);
            });
            
            self.model.on('add', function (item) {
                self.view.renderItem(item);
            });
        
            self.model.on('remove', function (item) {
                $('#'+item.id).remove();
            });
            
            self.model.on('change', function (collection) {
                self.view.renderItems(collection);
            });
            
            self.model.on('sync', function (collection) {
                self.view.renderItems(collection);
            });
            
            self.view.render(self);
        },
    });

    var AppModel = Tube.Model.extend({model: 'app'});
    
    var AppView = Tube.View.extend({
        initialize: function (params) {
            $('body').append(this.templates.app);
        }
    });

    var AppController = Tube.Controller.extend({
        initialize: function (params) {
            this.model = new AppModel();
            this.view = new AppView();
            this.items = new ItemsController();
        },
    });
    
    conn.on('/app', function (ready) {
        app = new AppController();
        
        // subscribe and initialize pubsub stream
        Tube.registerStream('items', conn, app.items.model.sync);
        
        //bootload the data
        app.items.model.read(app.items.model.sync);
        ready();
    });
    
};

var homepage = function (client, conn) {
    var $ = conn.$;
    
    conn.on('/', function (ready) {
        $('body').append('<div class="content"><h2>Home page</h2></div>');
        $('.content').append('<a href="/app">See the Demo</a>');
        ready();
    });
};

var express = Express.createServer();

express
    .use(Tube.middleware)
    .use(nQuery.bundle)
    .use(Express.static(__dirname + '/public'))
    .use(function (req, res, next) {
        res.render('app.ejs');
    })
    .listen(3000);

dnode
    .use(Tube.middleware)
    .use(nQuery)
    .use(todosApp)
    .use(homepage)
    .listen(express);

