'use strict'

const t = require('tap')
const { codes: errors } = require('../../lib/internal/errors')

function checkError(err, Base, name, code, message) {
  t.ok(err instanceof Base)
  t.equal(err.name, name)
  t.equal(err.code, code)
  t.equal(err.message, message)
}

// Update this numbers based on the number of checkError below multiplied by the assertions within checkError
t.plan(17 * 4)

checkError(
  new errors.ERR_INVALID_ARG_VALUE('name', 0),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_VALUE',
  "The argument 'name' is invalid. Received 0"
)

checkError(
  new errors.ERR_INVALID_ARG_VALUE('name', undefined),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_VALUE',
  "The argument 'name' is invalid. Received undefined"
)

checkError(
  new errors.ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], 0),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received type number (0)'
)

checkError(
  new errors.ERR_INVALID_ARG_TYPE('first argument', 'not string', 'foo'),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  "The first argument must be not string. Received type string ('foo')"
)

checkError(
  new errors.ERR_INVALID_ARG_TYPE('obj.prop', 'string', undefined),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The "obj.prop" property must be of type string. Received undefined'
)

checkError(
  new errors.ERR_STREAM_PUSH_AFTER_EOF(),
  Error,
  'Error',
  'ERR_STREAM_PUSH_AFTER_EOF',
  'stream.push() after EOF'
)

checkError(
  new errors.ERR_METHOD_NOT_IMPLEMENTED('_read()'),
  Error,
  'Error',
  'ERR_METHOD_NOT_IMPLEMENTED',
  'The _read() method is not implemented'
)

checkError(
  new errors.ERR_METHOD_NOT_IMPLEMENTED('_write()'),
  Error,
  'Error',
  'ERR_METHOD_NOT_IMPLEMENTED',
  'The _write() method is not implemented'
)

checkError(new errors.ERR_STREAM_PREMATURE_CLOSE(), Error, 'Error', 'ERR_STREAM_PREMATURE_CLOSE', 'Premature close')

checkError(
  new errors.ERR_STREAM_DESTROYED('pipe'),
  Error,
  'Error',
  'ERR_STREAM_DESTROYED',
  'Cannot call pipe after a stream was destroyed'
)

checkError(
  new errors.ERR_STREAM_DESTROYED('write'),
  Error,
  'Error',
  'ERR_STREAM_DESTROYED',
  'Cannot call write after a stream was destroyed'
)

checkError(
  new errors.ERR_MULTIPLE_CALLBACK(),
  Error,
  'Error',
  'ERR_MULTIPLE_CALLBACK',
  'Callback called multiple times'
)

checkError(new errors.ERR_STREAM_CANNOT_PIPE(), Error, 'Error', 'ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable')

checkError(new errors.ERR_STREAM_WRITE_AFTER_END(), Error, 'Error', 'ERR_STREAM_WRITE_AFTER_END', 'write after end')

checkError(
  new errors.ERR_STREAM_NULL_VALUES(),
  TypeError,
  'TypeError',
  'ERR_STREAM_NULL_VALUES',
  'May not write null values to stream'
)

checkError(
  new errors.ERR_UNKNOWN_ENCODING('foo'),
  TypeError,
  'TypeError',
  'ERR_UNKNOWN_ENCODING',
  'Unknown encoding: foo'
)

checkError(
  new errors.ERR_STREAM_UNSHIFT_AFTER_END_EVENT(),
  Error,
  'Error',
  'ERR_STREAM_UNSHIFT_AFTER_END_EVENT',
  'stream.unshift() after end event'
)
