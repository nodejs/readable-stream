"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const stream = require('../../');
const assert = require('assert/');
const readable = new stream.Readable({
  read: () => {}
});
const writables = [];
for (let i = 0; i < 5; i++) {
  const target = new stream.Writable({
    write: common.mustCall((chunk, encoding, callback) => {
      target.output.push(chunk);
      callback();
    }, 1)
  });
  target.output = [];
  target.on('pipe', common.mustCall());
  readable.pipe(target);
  writables.push(target);
}
const input = bufferShim.from([1, 2, 3, 4, 5]);
readable.push(input);

// The pipe() calls will postpone emission of the 'resume' event using nextTick,
// so no data will be available to the writable streams until then.
process.nextTick(common.mustCall(() => {
  for (var _i = 0, _writables = writables; _i < _writables.length; _i++) {
    const target = _writables[_i];
    assert.deepStrictEqual(target.output, [input]);
    target.on('unpipe', common.mustCall());
    readable.unpipe(target);
  }
  readable.push('something else'); // This does not get through.
  readable.push(null);
  readable.resume(); // Make sure the 'end' event gets emitted.
}));

readable.on('end', common.mustCall(() => {
  for (var _i2 = 0, _writables2 = writables; _i2 < _writables2.length; _i2++) {
    const target = _writables2[_i2];
    assert.deepStrictEqual(target.output, [input]);
  }
}));
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));