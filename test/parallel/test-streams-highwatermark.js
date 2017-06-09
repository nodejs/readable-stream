/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
require('../common');

// This test ensures that the stream implementation correctly handles values
// for highWaterMark which exceed the range of signed 32 bit integers.

var assert = require('assert/');
var stream = require('../../');

// This number exceeds the range of 32 bit integer arithmetic but should still
// be handled correctly.
var ovfl = Number.MAX_SAFE_INTEGER;

var readable = stream.Readable({ highWaterMark: ovfl });
assert.strictEqual(readable._readableState.highWaterMark, ovfl);

var writable = stream.Writable({ highWaterMark: ovfl });
assert.strictEqual(writable._writableState.highWaterMark, ovfl);