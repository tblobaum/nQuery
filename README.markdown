nodeQuery.js - bringing the $ to the server
============
A realtime server-side DOM manipulation framework

nodeQuery.js is a minimalist framework that brings DOM selectors 
live to the server side.

100% jQuery coverage is not a design goal but the current API matches
both jquery and zepto counterparts

The ultimate goal is to have a full fledged framework to modify the DOM 
in realtime from the server side. Similar to jquery and zepto.

Install
-------

    $ npm install nodeQuery
    

Use it on the server
-----

So far, the following methods have been implemented.  You may bind click events with live, 
and you are able to use all of the event types that are available with jquery or zepto.

    swipe swipeLeft swipeRight swipeUp swipeDown doubleTap tap longTap focusin focusout load 
    resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change 
    select keydown keypress keyup error

```javascript

dnode(function (client, conn) {

  conn.on('$', function () { // similar to $(document).ready()
    
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
    
  });
    
}).use(nodeQuery).listen(app);

````
Requirements:
-------------

Works with dnode, redis, and jquery or zepto to let you use a number
of (limited for now) methods on the server side, which will update the client 
element on the client machine right away.  Check out the clock example.

Examples:
---------
Check out the examples folder for a few demos. There are two different clocks 
that run based on the server time, and a twitter search app that implements 
backbone conventions.


