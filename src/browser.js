'use strict'

const Readable = require('./_stream_readable')

module.exports = Readable
module.exports.Stream = require('./internal/streams/legacy')
module.exports.Readable = Readable
module.exports.Writable = require('./_stream_writable')
module.exports.Duplex = require('./_stream_duplex')
module.exports.Transform = require('./_stream_transform')
module.exports.PassThrough = require('./_stream_passthrough')
module.exports.finished = require('./internal/streams/end-of-stream')
module.exports.pipeline = require('./internal/streams/pipeline')

// Allow default importing
module.exports.default = module.exports
