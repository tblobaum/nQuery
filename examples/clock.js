var express = require('express');
var Server = require('dnode');
var nQuery = require('../');

var example = function (client, conn) {
    conn.on('$', function (ready) {

        $('head').append('<style type="text/css"></style>');
        var style = '* { margin: 0; padding: 0; } #clock { position: relative; width: 600px; height: 600px; margin: 20px auto 0 auto; background: url(images/clockface.jpg); list-style: none; } #sec, #min, #hour { position: absolute; width: 30px; height: 600px; top: 0px; left: 285px; } #sec { background: url(images/sechand.png); z-index: 3; } #min { background: url(images/minhand.png); z-index: 2; } #hour { background: url(images/hourhand.png); z-index: 1; } p { text-align: center; padding: 10px 0 0 0; }';
        $('style').text(style);
        
	    var html = '<ul id="clock">' +
	       	           '<li id="sec"></li>' +
	       	           '<li id="hour"></li>' +
		               '<li id="min"></li>' +
	               '</ul>';
	               
        $('body').html('<h4>Current time from within node.js</h4>');
        $('body').append(html);
        
        setInterval( function() {
            var seconds = new Date().getSeconds();
            var sdegree = seconds * 6;
            var srotate = "rotate(" + sdegree + "deg)";

            $("#sec").css({"-moz-transform" : srotate, "-webkit-transform" : srotate});

        }, 500 );


        setInterval( function() {
            var hours = new Date().getHours();
            var mins = new Date().getMinutes();
            var hdegree = hours * 30 + (mins / 2);
            var hrotate = "rotate(" + hdegree + "deg)";

            $("#hour").css({"-moz-transform" : hrotate, "-webkit-transform" : hrotate});

        }, 1000 );


        setInterval( function() {
            var mins = new Date().getMinutes();
            var mdegree = mins * 6;
            var mrotate = "rotate(" + mdegree + "deg)";

            $("#min").css({"-moz-transform" : mrotate, "-webkit-transform" : mrotate});

        }, 1000 );

        ready();
    });
};

var app = express.createServer();
app.use(nQuery.bundle);
app.use(express.static(__dirname + '/public'));
app.listen(3000);

Server()
    .use(example)
    .use(nQuery)
    .listen(app);
    
