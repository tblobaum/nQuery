nQuery (beta)
=============

nQuery lets you use $() on the server to manipulate the browser side in realtime. It accomplishes 
this using Socket.io, Dnode, Browserify, and either jquery or Zepto.

nQuery is a minimalist DOM manipulation framework, it's fast, and its bringing all of the 
jquery methods to the server so you dont have to write (or serve!) any client side javascript in order to make a realtime browser application.

The current API matches both jquery and zepto counterparts, so you can include either one on the client side.

The goal is to have a full DOM manipulation framework that works in realtime from the server side.  This means you are mostly just setting attributes, html, values and binding events in jquery just like you would normally, but these methods work seamlessly with the server side of your code.


Install
-------

    $ npm install nodeQuery

Usage
-----
Create a file to serve up jquery and nquery and put it in /public

```html
<!doctype html>
<html>
<body>
<script type='text/javascript' src='/jquery.js' charset='utf-8'></script> 
<script type='text/javascript' src='/nquery.js' charset='utf-8'></script>
</body>
</html>
````

Create an app.js file

```javascript

var Express = require('express')
    , dnode = require('dnode')()
    , nQuery = require('../')
    , express = Express.createServer();
    
var app = function ($) {
    $.on('ready', function () {
        $('body').append('Hello World');
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


````

Visit the html file you created to see "Hello World"


Notes
-----
Remember that just because you can write jquery on the serer doesnt mean you will always want to.  A click event being bound to the server for a form is amazingly powerful, but if your mouseover or swipe event only changes the display features of your app (i.e. color, size) then it most likely still belongs on the client to reduce the server load.  There is a method in nQuery.js similar to $(document).ready() for the client as well as the server.  On the client it is nQuery.ready()

```html
<!doctype html>
<html>
<body>
<script type='text/javascript' src='/jquery.js' charset='utf-8'></script> 
<script type='text/javascript' src='/nquery.js' charset='utf-8'></script>
<script type='text/javascript'>
nQuery.ready(function(options) {
    // optionally get something from the server with ready(options)
    // do something once the server has fired "ready()"
    // ...
});
</script>
</body>
</html>
````

Methods
-------

So far only a limited number of jquery/zepto methods are available, but these include some 
of the most powerful functionality in jquery.  You may create live bindings to events and you
can use all of the event types that are available with jquery or zepto to do this, including:

    swipe swipeLeft swipeRight swipeUp swipeDown doubleTap tap longTap focusin focusout load     resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change     select keydown keypress keyup error

Sample usage of methods on the server:

```javascript

nQuery.use(function ($, connection) {
  // similar to '$(document).ready()', this function
  // is called after the client DOM is ready, a callback is passed
  // aswell, which calls 'nQuery.ready()' on the browser
  $.on('ready', function (callback) { 
    
    $('.container').append('<a href="#/click" class="clickable">Click me, Im a binding.</a>');
    
    $('.clickable').live('click', function () {
        $('.clickable').html('You clicked it!');
        $('.clickable').attr('href', console.log);
    });

    $('.container').append('<span class="hoverable">Hover me.</span>');
    
    $('.hoverable').live('mouseover', function () {
        $('.hoverable').html('hover event');
    });
    
    // bind an event to an element and any future elements that match the selector
    $('.title').live('swipe', function () {
        $('.title').html('swipe event');
    });
    
    // bind an event to an element which already exists in the dom
    $('.hoverable').bind('mouseout', function () {
        $('.hoverable').html('Im back again!');
    });
    
    // unbind an event
    $('.hoverable').unbind('mouseout', function () {
        $('.hoverable').html('Im back again!');
    });

    // get the name of the selector (useful to determine if html element exists)
    $('body').get(console.log);
    
    // get the number of elements
    $('body').size(console.log);
    
    // get the index of the element
    $('body').index(console.log);
    
    $('body').height(console.log);
    
    $('body').width(console.log);

    // set the html contents of the element(s)
    $('body').html('<div class="app"></div>');
    
    // set the text contents of the element(s)
    $('.app').text('Hello World');
    
    // add html (or a DOM Element) after the element
    $('.app').after('->>');
    
    // add html (or a DOM Element) before the element
    $('.app').before('<<-');
    
    // add html (or a DOM Element) at the beginning of the element contents
    $('.container').prepend('Clock:');
    
    // add html (or a DOM Element) at the end of the element contents
    $('.container').append('is the current time');
    
    // reverse of append
    $('.container').appendTo('.app');
    
    // reverse prepend
    $('.container').prependTo('.app');
    
    // replace element with html
    $('.foo').replaceWith('<div></div>');
    
    // forces elements to be hidden
    $('.clock').hide();
    
    // forces elements to be displayed
    $('.clock').show();
     
    // set a CSS property
    $('.clock').css('background-color', '#eee');
    
    // set an attribute
    $('.clock').attr('background-color', '#eee');
    
    // get an attribute
    $('.clock').attr(console.log);
    
    // serialize a form or list of elements
    $('.form').serialize(console.log);
    
    // call "nQuery.ready()" on the browser
    callback();
    
  });

});


````

More Examples:
---------
Check out the todos app written with [tubes](https://github.com/tblobaum/tubes) and nquery

Check out the examples folder for a few very simple demos. There are two different clocks 
that run based on the server time, a twitter search app that implements 
backbone conventions and a simple hello world app.

MIT License

