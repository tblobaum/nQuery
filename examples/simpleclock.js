var express = require('express');
var Server = require('dnode');
var nQuery = require('../');

var example = function (client, conn) {

    conn.on('$', function (ready) {
    
        setInterval( function() {
            $('body').html(new Date());
        }, 100 );
        
        ready();
    });
    
};

var expressApp = express.createServer();
expressApp.use(nQuery.bundle);
expressApp.use(express.static(__dirname + '/public'));
expressApp.listen(3000);

Server()
    .use(example)
    .use(nQuery)
    .listen(expressApp);
    
