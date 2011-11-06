var Dnode = require('dnode');

$(document).ready(function() {

    $.fn.formHash = function(map){
	    var isGet = (arguments.length == 0);
	    // create a hash to return
	    var hash = {};

	    // run the code for each form
	    this.filter("form").each(
		    function () {
			    // get all the form elements
			    var els = this.elements, el, n, fields = {}, $el;

			    // loop through the elements and process
			    for( var i=0, elsMax = els.length; i < elsMax; i++ ){
				    el = els[i]; 
				    n = el.name;

				    // if the element doesn't have a name, then skip it
				    if( !n || fields[n] ) continue;

				    // create a jquery object to the current named form elements (for fields containing apostrophe's, escape them)
				    var $el = $(el.form[n]);

				    // if we're getting the values, get them now
				    if( isGet ){
					    hash[n] = $el[defaults.useArray ? "fieldArray" : "getValue"]();
				    // if we're setting values, set them now
				    } else if( n in map ){
					    $el[defaults.useArray ? "fieldArray" : "setValue"](map[n]);
				    }

				    fields[n] = true;
			    }
		    }
	    );

	    // if getting a hash map return it, otherwise return the jQuery object
	    return (isGet) ? hash : this;
    };

    $.fn.fieldHash = function(map){
	    var isGet = !(map && typeof map == "object");
	    // create a hash to return
	    var hash = {}, fields = {};
	
	    // run the code for each form field
	    this.filter(":input").each(
		    function (){
			    var el = this, n = el.name;

			    // if the element doesn't have a name or it's already processed--stop
			    if( !n || fields[n] ) return;

			    // create a jquery object to the current named form elements (for fields containing apostrophe's, escape them)
			    var $el = $(el.form[n]);
			
			    // if we're getting the values, get them now
			    if( isGet ){
				    hash[n] = $el[defaults.useArray ? "fieldArray" : "getValue"]();
			    // if we're setting values, set them now
			    } else if( n in map ){
				    $el[defaults.useArray ? "fieldArray" : "setValue"](map[n]);
			    }

			    fields[n] = true;
		    }
	    );

	    // if getting a hash map return it, otherwise return the jQuery object
	    return (isGet) ? hash : this;
    };
    
});

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
            var r = fn.call($(params.context), params.args, function (e) {
                callback({type:e.type});
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
