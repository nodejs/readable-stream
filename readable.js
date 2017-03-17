exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

if (!process.browser) {
  var Stream = require('st' + 'ream');
  if (process.env.READABLE_STREAM === 'disable' && Stream) {
    module.exports =  Stream;
  }
}
