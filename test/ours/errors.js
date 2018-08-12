var tap = require('tap');
var assert = require('assert');
var errors = require('../../errors').codes;

function expect (err, Base, name, code, message) {
  assert(err instanceof Base);
  assert.strictEqual(err.name, name);
  assert.strictEqual(err.code, code);
  assert.strictEqual(err.message, message);
}

expect(
  new errors.ERR_INVALID_OPT_VALUE('name', 0),
  TypeError,
  'TypeError',
  'ERR_INVALID_OPT_VALUE',
  'The value "0" is invalid for option "name"'
);

expect(
  new errors.ERR_INVALID_OPT_VALUE('name', undefined),
  TypeError,
  'TypeError',
  'ERR_INVALID_OPT_VALUE',
  'The value "undefined" is invalid for option "name"'
);

expect(
  new errors.ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], 0),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The "chunk" argument must be one of type string, Buffer, or Uint8Array. Received type number'
);

expect(
  new errors.ERR_INVALID_ARG_TYPE('first argument', 'not string', 'foo'),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The first argument must not be of type string. Received type string'
);

expect(
  new errors.ERR_INVALID_ARG_TYPE('obj.prop', 'string', undefined),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The "obj.prop" property must be of type string. Received type undefined'
);

expect(
  new errors.ERR_STREAM_PUSH_AFTER_EOF(),
  Error,
  'Error',
  'ERR_STREAM_PUSH_AFTER_EOF',
  'stream.push() after EOF'
);

expect(
  new errors.ERR_METHOD_NOT_IMPLEMENTED('_read()'),
  Error,
  'Error',
  'ERR_METHOD_NOT_IMPLEMENTED',
  'The _read() method is not implemented'
);

expect(
  new errors.ERR_METHOD_NOT_IMPLEMENTED('_write()'),
  Error,
  'Error',
  'ERR_METHOD_NOT_IMPLEMENTED',
  'The _write() method is not implemented'
);

expect(
  new errors.ERR_STREAM_PREMATURE_CLOSE(),
  Error,
  'Error',
  'ERR_STREAM_PREMATURE_CLOSE',
  'Premature close'
);

expect(
  new errors.ERR_STREAM_DESTROYED('pipe'),
  Error,
  'Error',
  'ERR_STREAM_DESTROYED',
  'Cannot call pipe after a stream was destroyed'
);

expect(
  new errors.ERR_STREAM_DESTROYED('write'),
  Error,
  'Error',
  'ERR_STREAM_DESTROYED',
  'Cannot call write after a stream was destroyed'
);

expect(
  new errors.ERR_MULTIPLE_CALLBACK(),
  Error,
  'Error',
  'ERR_MULTIPLE_CALLBACK',
  'Callback called multiple times'
);

expect(
  new errors.ERR_STREAM_CANNOT_PIPE(),
  Error,
  'Error',
  'ERR_STREAM_CANNOT_PIPE',
  'Cannot pipe, not readable'
);

expect(
  new errors.ERR_STREAM_WRITE_AFTER_END(),
  Error,
  'Error',
  'ERR_STREAM_WRITE_AFTER_END',
  'write after end'
);

expect(
  new errors.ERR_STREAM_NULL_VALUES(),
  TypeError,
  'TypeError',
  'ERR_STREAM_NULL_VALUES',
  'May not write null values to stream'
);

expect(
  new errors.ERR_UNKNOWN_ENCODING('foo'),
  TypeError,
  'TypeError',
  'ERR_UNKNOWN_ENCODING',
  'Unknown encoding: foo'
);

expect(
  new errors.ERR_STREAM_UNSHIFT_AFTER_END_EVENT(),
  Error,
  'Error',
  'ERR_STREAM_UNSHIFT_AFTER_END_EVENT',
  'stream.unshift() after end event'
);

require('tap').pass('sync done');
