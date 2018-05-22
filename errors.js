'use strict';

const codes = {};

function createErrorType(name) {
  function E(message) {
    if (!Error.captureStackTrace)
      this.stack = (new Error()).stack;
    else
      Error.captureStackTrace(this, this.constructor);
    this.message = message;
  }
  E.prototype = new Error();
  E.prototype.name = name;
  E.prototype.constructor = E;

  codes[name] = E;
}

createErrorType('ERR_INVALID_OPT_VALUE');
createErrorType('ERR_INVALID_ARG_TYPE');
createErrorType('ERR_STREAM_PUSH_AFTER_EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED');
createErrorType('ERR_STREAM_PUSH_AFTER_EOF');

module.exports.codes = codes;
