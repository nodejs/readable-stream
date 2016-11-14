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

      // The browser build ends up with a circular dependency, so the require is
      // done lazily, but cached.
    , addDuplexDec = [
          headRegexp
        , '$1\n\n/*<replacement>*/\nvar Duplex;\n/*</replacement>*/\n'
    ]
    , addDuplexRequire = [
          /^(function (?:Writable|Readable)(?:State)?.*{)/gm
        , '\n$1\n  Duplex = Duplex || require(\'./_stream_duplex\');\n'
      ]

    , altForEachImplReplacement = require('./common-replacements').altForEachImplReplacement
    , altForEachUseReplacement  = require('./common-replacements').altForEachUseReplacement
    , altIndexOfImplReplacement = require('./common-replacements').altIndexOfImplReplacement
    , altIndexOfUseReplacement  = require('./common-replacements').altIndexOfUseReplacement

    , utilReplacement = [
          /^const util = require\('util'\);/m
        ,   '\n/*<replacement>*/\nconst util = require(\'core-util-is\');\n'
          + 'util.inherits = require(\'inherits\');\n/*</replacement>*/\n'
      ]

    , debugLogReplacement = [
          /const debug = util.debuglog\('stream'\);/
      ,   '\n\n/*<replacement>*/\nconst debugUtil = require(\'util\');\n'
        + 'let debug;\n'
        + 'if (debugUtil && debugUtil.debuglog) {\n'
        + '  debug = debugUtil.debuglog(\'stream\');\n'
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
        /^(const EE = require\('events'\));$/m
      ,   '/*<replacement>*/\n$1.EventEmitter;\n\n'
        + 'var EElistenerCount = function(emitter, type) {\n'
        + '  return emitter.listeners(type).length;\n'
        + '};\n/*</replacement>*/\n'
      ]

      , eventEmittterListenerCountReplacement = [
          /(EE\.listenerCount)/g
        ,   'EElistenerCount'
        ]

    , bufferIsEncodingReplacement = [
      /Buffer.isEncoding\((\w+)\)/
    ,   '([\'hex\', \'utf8\', \'utf-8\', \'ascii\', \'binary\', \'base64\',\n'
      + '\'ucs2\', \'ucs-2\',\'utf16le\', \'utf-16le\', \'raw\']\n'
      + '.indexOf(($1 + \'\').toLowerCase()) > -1)'
    ]

    , requireStreamReplacement = [
      /const Stream = require\('stream'\);/
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
    , `$1

/*<replacement>*/
  var processNextTick = require(\'process-nextick-args\');
/*</replacement>*/
`
    ]

    , processNextTickReplacement = [
      /process.nextTick\(/g
    , 'processNextTick('
    ]

    , internalUtilReplacement = [
          /^const internalUtil = require\('internal\/util'\);/m
        ,   '\n/*<replacement>*/\nconst internalUtil = {\n  deprecate: require(\'util-deprecate\')\n};\n'
          + '/*</replacement>*/\n'
      ],
      isNode10 = [
        headRegexp
      , `$1

/*<replacement>*/
  var asyncWrite = !process.browser && ['v0.10' , 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/
`
      ]
    , fixSyncWrite = [
      /if \(sync\) {\n\s+processNextTick\(afterWrite, stream, state, finished, cb\);\n\s+}/
      , `if (sync) {
      /*<replacement>*/
        asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    }

      `
    ]
  , bufferShimFix = [
    /const Buffer = require\('buffer'\)\.Buffer;/,
    `const Buffer = require('buffer').Buffer;
/*<replacement>*/
  const bufferShim = require('buffer-shims');
/*</replacement>*/`
  ]
  , bufferStaticMethods = [
    /Buffer\.((?:alloc)|(?:allocUnsafe)|(?:from))/g,
    `bufferShim.$1`
  ]
  , internalDirectory = [
    /require\('internal\/streams\/BufferList'\)/,
    'require(\'./internal/streams/BufferList\')'
  ]
  , fixInstanceCheck = [
    /if \(typeof Symbol === 'function' && Symbol\.hasInstance\) \{/,
    `if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {`
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
  , processNextTickImport
  , processNextTickReplacement
]

module.exports['_stream_passthrough.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_readable.js'] = [
    addDuplexRequire
  , addDuplexDec
  , requireReplacement
  , instanceofReplacement
  , altForEachImplReplacement
  , altForEachUseReplacement
  , altIndexOfImplReplacement
  , altIndexOfUseReplacement
  , instanceofReplacement
  , stringDecoderReplacement
  , isArrayReplacement
  , isArrayDefine
  , debugLogReplacement
  , utilReplacement
  , stringDecoderReplacement
  , eventEmittterReplacement
  , requireStreamReplacement
  , isBufferReplacement
  , processNextTickImport
  , processNextTickReplacement
  , eventEmittterListenerCountReplacement
  , bufferShimFix
  , bufferStaticMethods
  , internalDirectory
]

module.exports['_stream_transform.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , stringDecoderReplacement
]

module.exports['_stream_writable.js'] = [
    addDuplexRequire
  , addDuplexDec
  , requireReplacement
  , instanceofReplacement
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
  , isNode10
  , processNextTickImport
  , processNextTickReplacement
  , internalUtilReplacement
  , fixSyncWrite
  , bufferShimFix
  , bufferStaticMethods
  , fixInstanceCheck
]
module.exports['internal/streams/BufferList.js'] = [
    bufferShimFix
  , bufferStaticMethods
]
