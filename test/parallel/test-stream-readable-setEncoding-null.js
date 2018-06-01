/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

require('../common');
var assert = require('assert/');

var _require = require('../../'),
    Readable = _require.Readable;

{
  var readable = new Readable({ encoding: 'hex' });
  assert.strictEqual(readable._readableState.encoding, 'hex');

  readable.setEncoding(null);

  assert.strictEqual(readable._readableState.encoding, 'utf8');
}
;require('tap').pass('sync run');