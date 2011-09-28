nQuery.js
=========

nQuery.js lets you use $() on the server to manipulate the browser side in realtime. It does 
this using Socket.io, Dnode, Browserify, and either jquery or Zepto.

nQuery.js is a minimalist DOM manipulation framework, it's fast, and its bringing all of the 
jquery methods to the server so you dont have to write (or serve!) any client side javascript.

The current API matches both jquery and zepto counterparts, so you can use it with either one.

The goal is to have a full DOM manipulation framework that works in realtime from the server side.  This means you are mostly just setting attributes, html, values and binding events in jquery just like you would normally, but these methods work seamlessly with the server side of your code so you dont even have to think about a REST for your data.

You can write your jquery code right alongside your database calls (in a simple app) and you can completely forget about REST and HTTP, you dont need to create a representational state to transfer your data because you only ever transfer it directly into the DOM.

tl:dr; The stack is flat.  Realtime apps achieve newfound elegance.

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

var expressApp = express.createServer();

expressApp.use(nQuery.bundle);

expressApp.use(express.static(__dirname + '/public'));

expressApp.listen(3000);

var app = function (client, conn) {

    conn.on('$', function (ready) {
    
        $('body').append('Hello World');
        ready();
        
    });
    
};

Server()
    .use(app)
    .use(nQuery)
    .listen(expressApp);

````

Visit the html file you created to see "Hello World"


Methods
-------

So far only a limited number of jquery/zepto methods are available, but these include some 
of the most powerful functionality in jquery.  You may create live bindings to events and you
can use all of the event types that are available with jquery or zepto to do this, including:
    swipe swipeLeft swipeRight swipeUp swipeDown doubleTap tap longTap focusin focusout load     resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change     select keydown keypress keyup error

Here is some sample usage of most of the methods you can use:

```javascript

Server(function (client, conn) {

  conn.on('$', function (ready) { // similar to $(document).ready()
    
    $('.container').append('<a href="#/click" class="clickable">Click me, Im a binding.</a>');
    
    $('.clickable').live('click', function () {
        $('.clickable').html('You clicked it!');
        $('.clickable').attr('href', console.log);
    });

    $('.container').append('<span class="hoverable">Hover me.</span>');
    
    $('.hoverable').live('mouseover', function () {
        $('.hoverable').html('You hovered it!');
    });
    
    $('.hoverable').live('mouseout', function () {
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
    
    // call "nQuery.ready()" on the browser
    ready();
    
  });
    
}).use(nQuery).listen(expressApp);

````
Requirements:
-------------

Works with dnode, redis, and jquery or zepto to let you use a number
of (limited for now) methods on the server side, which will update the client 
element on the client machine right away.  Check out the clock example.

Examples:
---------
Check out the examples folder for a few demos. There are two different clocks 
that run based on the server time, a twitter search app that implements 
backbone conventions and a simple hello world app.


