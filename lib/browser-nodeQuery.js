var Dnode = require('dnode');
$(document).ready(function() {
    var client = Dnode(function (remote, conn) {
    
        this.nQhtml = function (params, callback) {
            callback('not yet implemented');
        };
        
        this.nQtext = function (params, callback) {
            callback('not yet implemented');
        };
        
        
        this.nQattr = function (params, callback) {
            callback($(params.context)[params.fn](params.args));
        };
        
        // Get requests
        this.nQget = function (params, callback) {
	        var r = $(params.context)[params.fn]();
	        
	        if (typeof r !== 'object') {
	            callback(r.toString());
	        } else if (typeof r === 'object') {
	            callback(r['selector']);
	        }
	    };
	    
        // Live Bindings
        this.nQlive = function (params, callback) {
	        var fn = $(params.context)[params.fn];
	        var r = fn.call($(params.context), params.args, function () {
	            callback();
	        });
	    };
	    
        this.nQset = function (params) {
            $(params.context)[params.fn](params.args);
        };

    });;
    
    client.connect(function (remote, conn) {
    
        conn.on('ready', function () {
        
            // Set requests
	        remote.nodeQuery('$', function (params, callback) {
	            var fn = $(params.context)[params.fn];
	            var r = fn.apply($(params.context), params.args);  
	        });
	        
        });
        
	    conn.on('end', function(data) {
            console.log('Connection was lost.');
	    });
	    
    });
});
