var browserify = require('browserify')
    , bfy = browserify({
        'entry': __dirname + '/browser.js',
        'require': ['dnode'],
        'filter': module.exports.filter,
        'mount': '/nquery.js',
    });

module.exports = function (client, conn, fn) {
    var self = this;
    if (client.res) bfy(client, conn, fn);
    else module.exports.fns.forEach(function (fn) { 
        fn.apply(self, [conn.$, conn, client]) 
    });
};

