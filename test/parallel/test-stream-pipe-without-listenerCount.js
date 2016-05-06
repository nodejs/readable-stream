/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');
var stream = require('../../');

var r = new stream.Stream();
r.listenerCount = undefined;

var w = new stream.Stream();
w.listenerCount = undefined;

w.on('pipe', function () {
  r.emit('error', new Error('Readable Error'));
  w.emit('error', new Error('Writable Error'));
});
r.on('error', common.mustCall(noop));
w.on('error', common.mustCall(noop));
r.pipe(w);

function noop() {}