/* This file lists the files to be fetched from the node repo
 * in the /lib/ directory which will be placed in the ../lib/
 * directory after having each of the "replacements" in the
 * array for that file applied to it. The replacements are
 * simply the arguments to String#replace, so they can be
 * strings, regexes, functions.
 */

const requireReplacement = [
          /(require\(['"])(_stream_)/g
        , '$1./$2'
      ]

    , instanceofReplacement = [
          /instanceof Stream\.(\w+)/g
        , function (match, streamType) {
            return 'instanceof ' + streamType
          }
      ]

      // use the string_decoder in node_modules rather than core
    , stringDecoderReplacement = [
          /(require\(['"])(string_decoder)(['"]\))/g
        , '$1$2/$3'
      ]
    , bufferReplacement = [
          /^(var util = require\('util'\);)/m
        , '$1\nvar Buffer = require(\'buffer\').Buffer;'
      ]
    , addDuplexRequire = [
          /^(function Writable\(options\) \{)/m
        , '$1\n  var Duplex = require(\'./_stream_duplex\');\n'
      ]

    , utilReplacement = [
          /require\('util'\);/
        ,   'require(\'core-util-is\');\n'
          + 'util.inherits = require(\'inherits\');\n'

      ]
    , debugLogReplacement = [
      /var debug = util.debuglog\('stream'\);/
      ,   'var debug = require(\'util\');\n'
        + 'if (debug && debug.debuglog) {\n'
        + '  debug = debug.debuglog(\'stream\');\n'
        + '} else {\n'
        + '  debug = function () {};\n'
        + '}\n'
    ], eventEmittterReplacement = [
        /(require\('events'\)\.EventEmitter;)/
      ,   '$1\n'
        + 'if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {\n'
        + '  return emitter.listeners(type).length;\n'
        + '};\n\n'
        + 'if (!global.setImmediate) global.setImmediate = function setImmediate(fn) {\n'
        + '  return setTimeout(fn, 0);\n'
        + '};\n'
        + 'if (!global.clearImmediate) global.clearImmediate = function clearImmediate(i) {\n'
        + '  return clearTimeout(i);\n'
        + '};\n'

    ]

module.exports['_stream_duplex.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_passthrough.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_readable.js'] = [
    requireReplacement
  , instanceofReplacement
  , bufferReplacement
  , utilReplacement
  , stringDecoderReplacement
  , debugLogReplacement
  , eventEmittterReplacement

]

module.exports['_stream_transform.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_writable.js'] = [
    addDuplexRequire
  , requireReplacement
  , instanceofReplacement
  , bufferReplacement
  , utilReplacement
  , stringDecoderReplacement
]
