var Express = require('express')
    , dnode = require('dnode')()
    , nQuery = require('../')
    , express = Express.createServer();

var app = function ($) {
    $.on('ready', function () {
        var items = 0;
    
        $('body').append('<a href="#" class="link">Add an Item.</a>');
        
        $('.link').live('click', function () {
            items++;
            $('body').append('<h5>Item added: total is now <em>' + items + '</em></h5>');
        });
    });
};

nQuery
  .use(app);

express
  .use(nQuery.middleware)
  .use(Express.static(__dirname + '/public'))
  .listen(3000);

dnode
  .use(nQuery.middleware)
  .listen(express);

