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
        $('.container').prepend('Clock:');
        $('.container').append('is the current time');
        $('.container').appendTo('.app');
        $('.container').prependTo('.app');
        $('.clock').hide();
        $('.clock').show();
        $('.clock').css('border', '2px');
        $('.clock').css('background-color', '#eee');
        $('div').append('!');
        setInterval(function () {
            $('.clock').html(new Date() );
        }, 50);
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
