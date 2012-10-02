'use strict';
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./transform.js');

var util = require('util');
util.inherits(PassThrough, Transform);

function PassThrough(options) {
  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, output, cb) {
  output(chunk);
  cb();
};
