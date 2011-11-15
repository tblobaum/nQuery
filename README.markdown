nQuery (beta) -- <a href='http://todos-nquery.nodejitsu.com/'>live demo</a>
=============
Introducing nQuery.js, a crazy new library that lets you write jQuery on the 
server. And yes it works with the browser in realtime. You can bind events 
directly to the server, such as swipe and hover using RPC.  Don't worry, it's fast.

nQuery is a minimalist DOM manipulation framework that is bringing jQuery 
methods to the server so you dont have to serve client side javascript in 
order to make a realtime cross-browser compatible 'lightweight' app.

The current API matches both jquery and zepto counterparts, so you can include 
either one on the client side for the same effect.

The goal is to have a full DOM manipulation framework that works in realtime 
from the server side.  If you can get away with only using jQuery in your 
application, this means you can completely isolate your client away from your
application logic.

<img src='http://upload.wikimedia.org/wikipedia/commons/3/3e/MVC_Diagram_3.jpg' />

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
<script src='//code.jquery.com/jquery.min.js' charset='utf-8'></script>
<script type='text/javascript' src='/nquery.js' charset='utf-8'></script>
</body>
</html>
````

Create an app.js file

```javascript

var Express = require('express')
  , dnode = require('dnode')()
  , nQuery = require('../')
  , express = Express.createServer()
  
var app = function ($) {
  $.on('ready', function () {
    $('body').append('Hello World')
  })
}

nQuery
  .use(app)

express
  .use(nQuery.middleware)
  .use(Express.static(__dirname + '/public'))
  .listen(3000)

dnode
  .use(nQuery.middleware)
  .listen(express)


````

Visit the html file you created to see "Hello World"


Methods
-------

Sample usage of methods on the server:

```javascript

nQuery
  .use(function ($) {

    // similar to $(document).ready, this function
    // is called after the client DOM is ready, a callback is passed
    // aswell, which calls nQuery.ready on the browser
    $.on('ready', function (callback) { 
      
      $('body').append('<a href="#" class="link">Click me, Im a binding.</a>')
      
      $('a.link').live('click', function () {
          $('a.link').html('You clicked it!')
      });

      $('body').append('<span class="hover">Hover me.</span>')
      
      $('.hover').live('mouseover', function () {
          $('.hover').html('hover event')
      });
      
      // bind an event to an element which already exists in the dom
      $('.hover').bind('mouseout', function () {
          $('.hover').html('Im back again!')
      });
      
      // bind an event to an element and any future elements that match the selector
      $('div').live('swipe', function () {
          $('div').html('swipe event')
      });
      
      // unbind an event
      $('.hoverable').unbind('mouseout', function () {
          $('.hoverable').html('Im back again!')
      });

      // get the name of the selector (useful to determine if html element exists)
      $('body').get(console.log)

      // get some other information about an element
      $('body').size(console.log)
      $('body').index(console.log)
      $('body').height(console.log)
      $('body').width(console.log)

      // set the html contents of the element(s)
      $('body').html('<div></div>')
      
      // set the text contents of the element(s)
      $('div').text('Hello World')
      
      // add html (or a DOM Element) after the element
      $('div').after('->>')
      
      // add html (or a DOM Element) before the element
      $('div').before('<<-')
      
      // add html (or a DOM Element) at the beginning of the element contents
      $('div').prepend('Clock:')
      
      // add html (or a DOM Element) at the end of the element contents
      $('div').append('is the current time')
      
      // reverse of append
      $('div').appendTo('.app')
      
      // reverse prepend
      $('div').prependTo('.app')
      
      // replace element with html
      $('div').replaceWith('<div></div>')
      
      // forces elements to be hidden
      $('div').hide()
      
      // forces elements to be displayed
      $('div').show()
       
      // set a CSS property
      $('div').css('background-color', '#eee')
      
      // set an attribute
      $('div').attr('background-color', '#eee')
      
      // get an attribute
      $('a').attr(console.log)
      
      // serialize a form or list of elements
      $('form').serialize(console.log)
      
      // call "nQuery.ready()" on the browser
      callback()
    })
  })


````

Events
-------

    swipe swipeLeft swipeRight swipeUp swipeDown doubleTap tap longTap focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change     select keydown keypress keyup error


Notes
-----
Remember that just because you can update your DOM from the server doesnt mean 
you will always want to. A click or swipe event being bound to the server 
can be amazingly responsive, but if the event only changes the display of your 
app (i.e. color, size) then it most likely still belongs on the client to 
reduce the server load.  There is a ready function in nQuery similar to 
$(document).ready() for the client as well as the server.

```html
<!doctype html>
<html>
<head><title>...</title></head>
<body>
<script src='//code.jquery.com/jquery.min.js' charset='utf-8'></script>
<script src='/nquery.js' charset='utf-8'></script>
<script>
nQuery.ready(function(options) {
    // optionally get something from the server with ready(options)
    // do something once the server has fired "ready()"
    // ...
});
</script>
</body>
</html>
````

More Examples:
---------
Check out the examples folder for a few simple demos.

MIT License

