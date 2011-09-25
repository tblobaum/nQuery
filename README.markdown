== nodeQuery.js: a server-side DOM manipulation framework

Zepto.js is a minimalist framework for mobile WebKit browsers,
with a jQuery-compatible chaining syntax.

nodeQuery.js is a minimalist framework that brings DOM selectors 
live to the server side.

100% jQuery coverage is not a design goal but the current API matches
both jquery and zepto counterparts

The ultimate goal is to have a full fledged framework to modify the DOM 
in realtime from the server side similar to jquery.

= Methods:

  html('new html'): set the contents of the element(s)
  text('new text'): set the text contents of the element(s)
  append(), prepend(): like html(), but add html (or a DOM Element or a Zepto object) to element contents
  before(), after(): add html (or a DOM Element or a Zepto object) before/after the element
  appendTo(), prependTo(): reverse appending/prepending
  show(): forces elements to be displayed (only works correctly for block elements right now)
  hide(): removes a elements from layout
  attr('attribute', 'value'): set element attribute
  css('css property', 'value'): set a CSS property

= Requirements:

This module works with dnode, redis, and jquery or zepto to let you use a number
of (limited for now) methods on the server side, which will update the client 
element on the client machine right away.  Check out the clock example.

= Example:

run app.js in the examples folder (install any packages you might need)
visit http://localhost:3000/index.html
