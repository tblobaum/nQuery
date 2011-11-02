var Express = require('express')
    , dnode = require('dnode')()
    , nQuery = require('../')
    , express = Express.createServer();

var app = function ($, connection) {

    $.on('ready', function () {
        $('head').append('<style type="text/css"></style>');
        
        var style = '* { margin: 0; padding: 0; } #clock { position: relative;'+
        'width: 600px; height: 600px; margin: 20px auto 0 auto;'+
        'background: url(images/clockface.jpg); list-style: none; } #sec,'+
        '#min, #hour { position: absolute; width: 30px; height: 600px;'+
        'top: 0px; left: 285px; } #sec { background: url(images/sechand.png);'+
        'z-index: 3; } #min { background: url(images/minhand.png); z-index:'+
        '2; } #hour { background: url(images/hourhand.png); z-index: 1; }'+
        'p { text-align: center; padding: 10px 0 0 0; }';
        
        $('style').text(style);
        
        var html = '<ul id="clock">'+
            '<li id="sec"></li>'+
         	  '<li id="hour"></li>'+
            '<li id="min"></li>'+
            '</ul>';
                 
        $('body')
            .html('<h4>Current time from within node.js</h4>')
            .append(html);
        
        setInterval( function() {
            var ms =(new Date().getSeconds()*1000)+new Date().getMilliseconds()
                , sdegree = (ms * 0.006)
                , srotate = "rotate(" + sdegree + "deg)";
                
            $("#sec").css({"-moz-transform":srotate,"-webkit-transform":srotate});
        }, 70 );

        setInterval( function() {
            var hours = new Date().getHours()
                , mins = new Date().getMinutes()
                , hdegree = hours * 30 + (mins / 2)
                , hrotate = "rotate(" + hdegree + "deg)";
                
            $("#hour").css({"-moz-transform":hrotate,"-webkit-transform":hrotate});
        }, 1000 );

        setInterval( function() {
            var mins = new Date().getMinutes()
                , mdegree = mins * 6
                , mrotate = "rotate(" + mdegree + "deg)";
                
            $("#min").css({"-moz-transform":mrotate,"-webkit-transform":mrotate});
        }, 1000 );

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

