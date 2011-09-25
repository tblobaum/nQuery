nodeQuery.js 
============
A realtime server-side DOM manipulation framework

Zepto.js is a minimalist framework for mobile WebKit browsers,
with a jQuery-compatible chaining syntax.

nodeQuery.js is a minimalist framework that brings DOM selectors 
live to the server side.

100% jQuery coverage is not a design goal but the current API matches
both jquery and zepto counterparts

The ultimate goal is to have a full fledged framework to modify the DOM 
in realtime from the server side similar to jquery.

Use it on the server
-----
```javascript

dnode(function (client, conn) {

  conn.on('$', function () { // similar to $(document).ready()
    
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
    
  });
    
}).use(nodeQuery).listen(app);

````
Requirements:
-------------

Works with dnode, redis, and jquery or zepto to let you use a number
of (limited for now) methods on the server side, which will update the client 
element on the client machine right away.  Check out the clock example.

Example:
--------
run app.js in the examples folder (install any packages you might need)
and then visit http://localhost:3000/index.html for a realtime clock
