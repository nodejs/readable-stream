# readable-stream

An exploration of a new kind of readable streams for Node.js

This is an abstract class designed to be extended.  It also provides a
`wrap` method that you can use to provide the simpler readable API for
streams that have the "readable stream" interface of Node 0.8 and
before.

## Usage

```javascript
var Readable = require('readable-stream');
var r = new Readable();

r.read = function(n) {
  // your magic goes here.
  // return n bytes, or null if there is nothing to be read.
  // if you return null, then you MUST emit 'readable' at some
  // point in the future if there are bytes available, or 'end'
  // if you are not going to have any more data.
};

r.on('end', function() {
  // no more bytes will be provided.
});

r.on('readable', function() {
  // now is the time to call read() again.
});
```
