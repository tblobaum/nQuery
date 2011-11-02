var Express = require('express')
    , dnode = require('dnode')()
    , nQuery = require('../')
    , express = Express.createServer();
    
var app = function ($) {
    $.on('ready', function () {
        $('body').append('Hello World');
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

