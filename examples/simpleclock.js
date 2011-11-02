var Express = require('express')
    , dnode = require('dnode')()
    , nQuery = require('../')
    , express = Express.createServer();
  
var app = function ($, connection) {
    $.on('ready', function () {
        setInterval( function() {
            $('body').html('<h1>' + new Date() + '</h1>');
        }, 100 );
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

