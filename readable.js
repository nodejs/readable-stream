exports = module.exports = require('./lib/_stream_readable.js');
var s = exports.Stream = require('stream');
exports.Readable = s.Readable = exports;
exports.Writable = s.Writable = require('./lib/_stream_writable.js');
exports.Duplex = s.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = s.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = s.PassThrough = require('./lib/_stream_passthrough.js');
