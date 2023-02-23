"use strict";

if (process.version.indexOf('v0.8') === 0) {
  process.exit(0);
}
/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const assert = require('assert/');
const _require = require('../../'),
  Writable = _require.Writable,
  Readable = _require.Readable;
class NullWriteable extends Writable {
  _write(chunk, encoding, callback) {
    return callback();
  }
}
class QuickEndReadable extends Readable {
  _read() {
    this.push(null);
  }
}
class NeverEndReadable extends Readable {
  _read() {}
}
{
  const dest = new NullWriteable();
  const src = new QuickEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustCall());
  src.pipe(dest);
  setImmediate(() => {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}
{
  const dest = new NullWriteable();
  const src = new NeverEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  src.pipe(dest);
  setImmediate(() => {
    assert.strictEqual(src._readableState.pipesCount, 1);
  });
}
{
  const dest = new NullWriteable();
  const src = new NeverEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustCall());
  src.pipe(dest);
  src.unpipe(dest);
  setImmediate(() => {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}
{
  const dest = new NullWriteable();
  const src = new QuickEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustCall());
  src.pipe(dest, {
    end: false
  });
  setImmediate(() => {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}
{
  const dest = new NullWriteable();
  const src = new NeverEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustNotCall('unpipe should not have been emitted'));
  src.pipe(dest, {
    end: false
  });
  setImmediate(() => {
    assert.strictEqual(src._readableState.pipesCount, 1);
  });
}
{
  const dest = new NullWriteable();
  const src = new NeverEndReadable();
  dest.on('pipe', common.mustCall());
  dest.on('unpipe', common.mustCall());
  src.pipe(dest, {
    end: false
  });
  src.unpipe(dest);
  setImmediate(() => {
    assert.strictEqual(src._readableState.pipesCount, 0);
  });
}
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));