/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

// This test verifies that:
// 1. unshift() does not cause colliding _read() calls.
// 2. unshift() after the 'end' event is an error, but after the EOF
//    signalling null, it is ok, and just creates a new readable chunk.
// 3. push() after the EOF signaling null is an error.
// 4. _read() is not called after pushing the EOF null chunk.

var stream = require('../../');
var hwm = 10;
var r = stream.Readable({ highWaterMark: hwm });
var chunks = 10;

var data = bufferShim.allocUnsafe(chunks * hwm + Math.ceil(hwm / 2));
for (var i = 0; i < data.length; i++) {
  var c = 'asdf'.charCodeAt(i % 4);
  data[i] = c;
}

var pos = 0;
var pushedNull = false;
r._read = function (n) {
  assert(!pushedNull, '_read after null push');

  // every third chunk is fast
  push(!(chunks % 3));

  function push(fast) {
    assert(!pushedNull, 'push() after null push');
    var c = pos >= data.length ? null : data.slice(pos, Math.min(pos + n, data.length));
    pushedNull = c === null;
    if (fast) {
      pos += n;
      r.push(c);
      if (c === null) pushError();
    } else {
      setTimeout(function () {
        pos += n;
        r.push(c);
        if (c === null) pushError();
      }, 1);
    }
  }
};

function pushError() {
  assert.throws(function () {
    r.push(bufferShim.allocUnsafe(1));
  }, /^Error: stream.push\(\) after EOF$/);
}

var w = stream.Writable();
var written = [];
w._write = function (chunk, encoding, cb) {
  written.push(chunk.toString());
  cb();
};

r.on('end', common.mustCall(function () {
  assert.throws(function () {
    r.unshift(bufferShim.allocUnsafe(1));
  }, /^Error: stream.unshift\(\) after end event$/);
  w.end();
}));

r.on('readable', function () {
  var chunk = void 0;
  while (null !== (chunk = r.read(10))) {
    w.write(chunk);
    if (chunk.length > 4) r.unshift(bufferShim.from('1234'));
  }
});

w.on('finish', common.mustCall(function () {
  // each chunk should start with 1234, and then be asfdasdfasdf...
  // The first got pulled out before the first unshift('1234'), so it's
  // lacking that piece.
  assert.strictEqual(written[0], 'asdfasdfas');
  var asdf = 'd';
  console.error('0: %s', written[0]);
  for (var _i = 1; _i < written.length; _i++) {
    console.error('%s: %s', _i.toString(32), written[_i]);
    assert.strictEqual(written[_i].slice(0, 4), '1234');
    for (var j = 4; j < written[_i].length; j++) {
      var _c = written[_i].charAt(j);
      assert.strictEqual(_c, asdf);
      switch (asdf) {
        case 'a':
          asdf = 's';break;
        case 's':
          asdf = 'd';break;
        case 'd':
          asdf = 'f';break;
        case 'f':
          asdf = 'a';break;
      }
    }
  }
}));

process.on('exit', function () {
  assert.strictEqual(written.length, 18);
  console.log('ok');
});