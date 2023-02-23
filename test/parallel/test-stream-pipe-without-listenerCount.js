"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const stream = require('../../');
const r = new stream.Stream();
r.listenerCount = undefined;
const w = new stream.Stream();
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
_list.forEach(e => process.on('uncaughtException', e));