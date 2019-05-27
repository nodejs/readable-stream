"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
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
r.on('error', common.mustCall());
w.on('error', common.mustCall());
r.pipe(w);
;

(function () {
  var t = require('tap');

  t.pass('sync run');
})();

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});