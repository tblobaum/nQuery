var Dnode = require('dnode');

window.nQuery = new function () {
    var self = this;
    self.readyList = [];
    self.closedList = [];
    
    this.ready = function (callback) {
        self.readyList.push(callback);
    };
    
    this.closed = function (callback) {
        self.closedList.push(callback);
    };
    
    this.isReady = function (options) {
        for (var i=0, l=self.readyList.length; i<l; i++) {
            self.readyList[i](options);
        }
    };
    
    this.isClosed = function (options) {
        for (var i=0, l=self.closedList.length; i<l; i++) {
            self.closedList[i](options);
        }
    };
};

$(document).ready(function() {

    var dnode = Dnode(function (remote, conn) {        
        
        window.Server = remote;
        window.Conn = conn;
        
        this.nQattr = function (params, callback) {
            callback($(params.context)[params.fn](params.args));
        };
        
        this.nQget = function (params, callback) {
	        var r = $(params.context)[params.fn]();
	        
	        if (typeof r !== 'object') {
	            callback(r.toString());
	        } else if (typeof r === 'object') {
	            callback(r['selector']);
	        }
	    };
	    
        this.nQlive = function (params, callback) {
	        var fn = $(params.context)[params.fn];
	        var r = fn.call($(params.context), params.args, function () {
	            callback();
	        });
	    };
	    
        this.nQset = function (params) {
            $(params.context)[params.fn].apply($(params.context), params.args);
        };
        
        this.nQhtml = function (params, callback) {
            callback('not yet implemented');
        };
        
        this.nQtext = function (params, callback) {
            callback('not yet implemented');
        };
    });
    
    dnode.connect(function (remote, conn) {
    
        conn.on('ready', function () {
	        remote.nodeQuery(String(window.location), window.nQuery.isReady);
        });
        
	    conn.on('end', function(data) {
	        window.nQuery.isClosed(data);
	    });
	    
    });
    
});
