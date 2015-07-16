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

    , deprecateReplacement = [
          /util.deprecate/
      ,   'require(\'util-deprecate\')'
      ]

    , objectDefinePropertyReplacement = [
          /(Object\.defineProperties)/
      ,   'if (Object.defineProperties) $1'
      ]
    , objectDefinePropertySingReplacement = [
          /Object\.defineProperty\(([\w\W]+?)\}\);/
      ,   '(function (){try {\n'
        + 'Object.defineProperty\($1});\n'
        + '}catch(_){}}());\n'
      ]

    , isArrayDefine = [
          headRegexp
        , '$1\n\n/*<replacement>*/\nvar isArray = require(\'isarray\');\n/*</replacement>*/\n'
      ]

    , isArrayReplacement = [
          /Array\.isArray/g
        , 'isArray'
      ]

    , objectKeysDefine = require('./common-replacements').objectKeysDefine

    , objectKeysReplacement = require('./common-replacements').objectKeysReplacement

    , eventEmittterReplacement = [
        /(require\('events'\)\.EventEmitter;)/
      ,   '$1\n\n/*<replacement>*/\n'
        + 'if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {\n'
        + '  return emitter.listeners(type).length;\n'
        + '};\n/*</replacement>*/\n'
      ]

    , constReplacement = [
        /const/g
      , 'var'
      ]

    , bufferIsEncodingReplacement = [
      /Buffer.isEncoding\((\w+)\)/
    ,   '([\'hex\', \'utf8\', \'utf-8\', \'ascii\', \'binary\', \'base64\',\n'
      + '\'ucs2\', \'ucs-2\',\'utf16le\', \'utf-16le\', \'raw\']\n'
      + '.indexOf(($1 + \'\').toLowerCase()) > -1)'
    ]

    , requireStreamReplacement = [
      /var Stream = require\('stream'\);/
    ,  '\n\n/*<replacement>*/\n'
      + 'var Stream;\n(function (){try{\n'
      + '  Stream = require(\'st\' + \'ream\');\n'
      + '}catch(_){}finally{\n'
      + '  if (!Stream)\n'
      + '    Stream = require(\'events\').EventEmitter;\n'
      + '}}())'
      + '\n/*</replacement>*/\n'
    ]

    , isBufferReplacement = [
      /(\w+) instanceof Buffer/g
    , 'Buffer.isBuffer($1)'
    ]

    , processNextTickImport = [
      headRegexp
    , '$1\n\n/*<replacement>*/\nvar processNextTick = require(\'process-nextick-args\');\n/*</replacement>*/\n'
    ]

    , processNextTickReplacement = [
      /process.nextTick\(/g
    , 'processNextTick('
    ]

module.exports['_stream_duplex.js'] = [
    constReplacement
  , requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
  , altForEachImplReplacement
  , altForEachUseReplacement
  , objectKeysReplacement
  , objectKeysDefine
  , processNextTickImport
  , processNextTickReplacement
]

module.exports['_stream_passthrough.js'] = [
    constReplacement
  , requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_readable.js'] = [
    constReplacement
  , addDuplexRequire
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
  , eventEmittterReplacement
  , requireStreamReplacement
  , isBufferReplacement
  , processNextTickImport
  , processNextTickReplacement

]

module.exports['_stream_transform.js'] = [
    constReplacement
  , requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_writable.js'] = [
    constReplacement
  , addDuplexRequire
  , requireReplacement
  , instanceofReplacement
  , bufferReplacement
  , utilReplacement
  , stringDecoderReplacement
  , debugLogReplacement
  , deprecateReplacement
  , objectDefinePropertyReplacement
  , objectDefinePropertySingReplacement
  , bufferIsEncodingReplacement
  , [ /^var assert = require\('assert'\);$/m, '' ]
  , requireStreamReplacement
  , isBufferReplacement
  , processNextTickImport
  , processNextTickReplacement
]
