'use strict'

const Stream = require('stream')

if (Stream && process.env.READABLE_STREAM === 'disable') {
  module.exports = Stream.Readable

  module.exports.Stream = require('./internal/streams/legacy')
  module.exports.Readable = Stream.Readable
  module.exports.Writable = Stream.Writable
  module.exports.Duplex = Stream.Duplex
  module.exports.Transform = Stream.Transform
  module.exports.PassThrough = Stream.PassThrough
  module.exports.finished = Stream.finished
  module.exports.pipeline = Stream.pipeline
} else {
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
}

// Allow default importing
module.exports.default = module.exports
