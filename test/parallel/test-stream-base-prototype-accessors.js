/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

require('../common');

// This tests that the prototype accessors added by StreamBase::AddMethods
// do not raise assersions when called with incompatible receivers.

var assert = require('assert/');

// Or anything that calls StreamBase::AddMethods when setting up its prototype
var TTY = process.binding('tty_wrap').TTY;

// Should throw instead of raise assertions
{
  var msg = /TypeError: Method \w+ called on incompatible receiver/;
  assert.throws(function () {
    TTY.prototype.bytesRead;
  }, msg);

  assert.throws(function () {
    TTY.prototype.fd;
  }, msg);

  assert.throws(function () {
    TTY.prototype._externalStream;
  }, msg);
}