var express = require('express');
var Server = require('dnode');
var nQuery = require('../');

var app = express.createServer();
app.use(nQuery.bundle);
app.use(express.static(__dirname + '/public'));
app.listen(3000);

var Application = function (client, conn) {
    conn.on('$', function (ready) {
        $('body').append('Hello World');
        ready();
    });
};

Server()
    .use(Application)
    .use(nQuery)
    .listen(app);
