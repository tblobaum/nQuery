var Dnode = require('dnode');
$(document).ready(function() {
    var client = Dnode();
    client.connect(function(remote, conn) {
	    remote.nodeQuery('$', function (params, callback) {
	        var fn = $(params.context)[params.fn];
	        var r = fn.apply($(params.context), params.args);  
	    });
	    conn.on('end', function(data) {
            console.log('Connection was lost.');
	    });
    });
}); 
