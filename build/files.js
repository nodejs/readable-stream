/* This file lists the files to be fetched from the node repo
 * in the /lib/ directory which will be placed in the ../lib/
 * directory after having each of the "replacements" in the
 * array for that file applied to it. The replacements are
 * simply the arguments to String#replace, so they can be
 * strings, regexes, functions.
 */

const headRegexp = /(^module.exports = \w+;?)/m

    , requireReplacement = [
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
          headRegexp
        , '$1\n\n/*<replacement>*/\nvar Buffer = require(\'buffer\').Buffer;\n/*</replacement>*/\n'
      ]

    , addDuplexRequire = [
          /^(function (?:Writable|Readable)(?:State)?.*{)/gm
        , '$1\n  var Duplex = require(\'./_stream_duplex\');\n'
      ]

    , altForEachImplReplacement = require('./common-replacements').altForEachImplReplacement
    , altForEachUseReplacement  = require('./common-replacements').altForEachUseReplacement
    , altIndexOfImplReplacement = require('./common-replacements').altIndexOfImplReplacement
    , altIndexOfUseReplacement  = require('./common-replacements').altIndexOfUseReplacement

    , utilReplacement = [
          /^var util = require\('util'\);/m
        ,   '\n/*<replacement>*/\nvar util = require(\'core-util-is\');\n'
          + 'util.inherits = require(\'inherits\');\n/*</replacement>*/\n'
      ]

    , debugLogReplacement = [
          /var debug = util.debuglog\('stream'\);/
      ,   '\n\n/*<replacement>*/\nvar debug = require(\'util\');\n'
        + 'if (debug && debug.debuglog) {\n'
        + '  debug = debug.debuglog(\'stream\');\n'
        + '} else {\n'
        + '  debug = function () {};\n'
        + '}\n/*</replacement>*/\n'
      ]

    , isArrayDefine = [
          headRegexp
        , '$1\n\n/*<replacement>*/\nvar isArray = require(\'isarray\');\n/*</replacement>*/\n'
      ]

    , isArrayReplacement = [
          /Array\.isArray/g
        , 'isArray'
      ]

    , objectKeysDefine = [
          headRegexp
        , '$1\n\n/*<replacement>*/\nvar objectKeys = Object.keys || function (obj) {\n'
          + '  var keys = [];\n'
          + '  for (var key in obj) keys.push(key);\n'
          + '  return keys;\n'
          + '}\n/*</replacement>*/\n'
      ]

    , objectKeysReplacement = [
          /Object\.keys/g
        , 'objectKeys'
      ]

    , eventEmittterReplacement = [
        /(require\('events'\)\.EventEmitter;)/
      ,   '$1\n\n/*<replacement>*/\n'
        + 'if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {\n'
        + '  return emitter.listeners(type).length;\n'
        + '};\n/*</replacement>*/\n'
    ]

module.exports['_stream_duplex.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
  , altForEachImplReplacement
  , altForEachUseReplacement
  , objectKeysReplacement
  , objectKeysDefine
]

module.exports['_stream_passthrough.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_readable.js'] = [
    addDuplexRequire
  , requireReplacement
  , instanceofReplacement
  , bufferReplacement
  , altForEachImplReplacement
  , altForEachUseReplacement
  , altIndexOfImplReplacement
  , altIndexOfUseReplacement
  , instanceofReplacement
  , stringDecoderReplacement
  , isArrayDefine
  , isArrayReplacement
  , debugLogReplacement
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
  , [ /^var assert = require\('assert'\);$/m, '' ]
]
