dnode          = require('dnode');
browserify     = require('browserify');
express        = require('express');
redis          = require('redis');
nodeQuery      = require('../');
nQpath         = nodeQuery.path;

example = function (client, conn) {
    conn.on('$', function () {
        setInterval( function() {
            $('body').html(new Date());
        }, 100 );
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
    
