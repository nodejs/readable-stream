'use strict';

import _readableDenoJs from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const stream = _readableDenoJs;

class MyWritable extends stream.Writable {
  _write(chunk, encoding, callback) {
    assert.notStrictEqual(chunk, null);
    callback();
  }

}

common.expectsError(() => {
  const m = new MyWritable({
    objectMode: true
  });
  m.write(null, err => assert.ok(err));
}, {
  code: 'ERR_STREAM_NULL_VALUES',
  type: TypeError,
  message: 'May not write null values to stream'
});
{
  // Should not throw.
  const m = new MyWritable({
    objectMode: true
  }).on('error', assert);
  m.write(null, assert);
}
common.expectsError(() => {
  const m = new MyWritable();
  m.write(false, err => assert.ok(err));
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  type: TypeError
});
{
  // Should not throw.
  const m = new MyWritable().on('error', assert);
  m.write(false, assert);
}
{
  // Should not throw.
  const m = new MyWritable({
    objectMode: true
  });
  m.write(false, assert.ifError);
}
{
  // Should not throw.
  const m = new MyWritable({
    objectMode: true
  }).on('error', e => {
    assert.ifError(e || new Error('should not get here'));
  });
  m.write(false, assert.ifError);
}
export default module.exports;