/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var stream = require('../../');
var PassThrough = stream.PassThrough;

var src = new PassThrough({ objectMode: true });
var tx = new PassThrough({ objectMode: true });
var dest = new PassThrough({ objectMode: true });

var expect = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var results = [];

dest.on('data', common.mustCall(function (x) {
  results.push(x);
}, expect.length));

src.pipe(tx).pipe(dest);

var i = -1;
var int = setInterval(common.mustCall(function () {
  if (results.length === expect.length) {
    src.end();
    clearInterval(int);
    assert.deepStrictEqual(results, expect);
  } else {
    src.write(i++);
  }
}, expect.length + 1), 1);