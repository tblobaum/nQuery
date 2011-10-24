var express = require('express');
var Server = require('dnode');
var nQuery = require('../');

var expressApp = express.createServer();
expressApp.use(nQuery.bundle);
expressApp.use(express.static(__dirname + '/public'));
expressApp.listen(3000);

var app = function (client, conn) {
    conn.on('$', function (ready) {
        var $ = conn.$;
        $('body').append('Hello World');
        ready();
    });
};

Server()
    .use(app)
    .use(nQuery)
    .listen(expressApp);
