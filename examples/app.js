dnode          = require('dnode');
browserify     = require('browserify');
express        = require('express');
redis          = require('redis');
nodeQuery      = require('../');
nQpath         = nodeQuery.path;

example = function (client, conn) {
    conn.on('$', function () {
        $('body').html('<div class="app"></div><div class="container"></div>');
        $('.container').html('<h3 class="clock"> </h3>');
        $('.clock').html(new Date().getTime());
        $('.app').text('Hello World');
        $('.app').after('->>');
        $('.app').before('<<-');
        $('.container').prepend('<h3>Current time</h3>');
        $('.container').append('<small>from the server</small>');
        $('.container').appendTo('.app');
        $('.container').prependTo('.app');
        $('.clock').hide();
        $('.clock').show();
        $('.app').css('border', '2px solid #222');
        $('.app').css('background-color', '#eee');
        $('.clock').attr('title', 'Current time');
        $('div').append('!');
        setInterval(function () {
            $('.clock').html(new Date() );
        }, 100);
        
        $('.container').append('<a href="#/clickable" class="clickable">Click me, Im a binding.</a>');
        
        $('.clickable').live('click', function () {
            $('.clickable').html('You clicked it!');
            console.log('Clicked link ');
            $('.clickable').attr('href', console.log);
        });

        $('.container').append('<span class="hoverable">Hover me.</span>');
        
        $('.hoverable').live('mouseover', function () {
            $('.hoverable').html('You hovered it!');
        });
        
        $('.hoverable').live('mouseout', function () {
            $('.hoverable').html('Im back again!');
        });
        
        $('body').get(console.log);
        $('body').size(console.log);
        $('body').index(console.log);
        $('body').height(console.log);
        $('body').width(console.log);
    });
};

app = express.createServer();

var bundle = browserify({
    'entry': nQpath,
    'require': ['dnode'],
    'filter': require('uglify-js'),
    'mount': '/nodeQuery.js',
});

app.use(bundle);
app.use(express.static(__dirname + '/public'));
app.listen(3000);

dnode()
    .use(example)
    .use(nodeQuery)
    .listen(app);
