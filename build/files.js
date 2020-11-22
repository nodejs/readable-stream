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

    , altIndexOfImplReplacement = require('./common-replacements').altIndexOfImplReplacement
    , altIndexOfUseReplacement  = require('./common-replacements').altIndexOfUseReplacement

    , utilReplacement = [
          /^const util = require\('util'\);/m
        , ''
      ]

    , inherits = [
          /^util.inherits/m
        , 'require(\'inherits\')'
      ]

    , debugLogReplacement = [
          /const debug = util.debuglog\('stream'\);/
      , `
      /*<replacement>*/
      let CrossplatformUtil;
      if(typeof DenoUtil === "undefined"){
        CrossplatformUtil = require('util');
      }else{
        CrossplatformUtil = DenoUtil;
      }
      /*</replacement>*/
      let debug;
      if (CrossplatformUtil && CrossplatformUtil.debuglog) {
        debug = CrossplatformUtil.debuglog('stream');
      } else {
        debug = function () {};
      }`
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
    , bufferReplacement = [
      /Buffer\./g,
      'CrossplatformBuffer.'
    ]
    , requireStreamReplacement = [
      /const Stream = require\('stream'\);/
    ,  '\n\n/*<replacement>*/\n'
      + 'var Stream = require(\'./internal/streams/stream\')'
      + '\n/*</replacement>*/\n'
    ]
    , isBufferReplacement = [
      /(\w+) instanceof Buffer/g
    , 'CrossplatformBuffer.isBuffer($1)'
    ]
    , requireBufferReplacement = [
      /(?:var|const) (?:{ )Buffer(?: }) = require\('buffer'\)(?:\.Buffer)?;/g
    ,  `
    let CrossplatformBuffer;
    if(typeof Buffer === "undefined"){
      CrossplatformBuffer = require('buffer').Buffer;
    }else{
      CrossplatformBuffer = Buffer;
    }`
    ]
    , internalUtilReplacement = [
          /^const internalUtil = require\('internal\/util'\);/m
        ,
        `
        /*<replacement>*/
        let deprecate;
        if(typeof DenoUtil === "undefined"){
          deprecate = require('util-deprecate');
        }else{
          deprecate = DenoUtil.deprecate;
        }
        const internalUtil = { deprecate };
        /*</replacement>*/
        `
      ]
  , internalDirectory = [
    /require\('internal\/streams\/([a-zA-z]+)'\)/g,
    'require(\'./internal/streams/$1\')'
  ]
  , fixInstanceCheck = [
    /if \(typeof Symbol === 'function' && Symbol\.hasInstance\) \{/,
    `if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {`
  ]
  , removeOnWriteBind = [
      /onwrite\.bind\([^)]+?\)/
    , `function(er) { onwrite(stream, er); }`
  ]
  , addUintStuff = [
    /(?:var|const) (?:{ )Buffer(?: }) = require\('buffer'\)(?:\.Buffer)?;/g
    , `
  let CrossplatformBuffer;
  if(typeof Buffer === "undefined"){
    CrossplatformBuffer = require('buffer').Buffer;
  }else{
    CrossplatformBuffer = Buffer;
  }
  const OurUint8Array = global.Uint8Array || function () {}
function _uint8ArrayToBuffer(chunk) {
   return CrossplatformBuffer.from(chunk);
}
function _isUint8Array(obj) {
  return CrossplatformBuffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
  `
  ]
  , addConstructors = [
      headRegexp
    , `$1

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  this.next = null;
  this.entry = null;
  this.finish = () => { onCorkedFinish(this, state) };
}
/* </replacement> */
`
  ]
  , useWriteReq = [
      /state\.lastBufferedRequest = \{.+?\}/g
    , `state.lastBufferedRequest = new WriteReq(chunk, encoding, cb)`
  ]
  , useCorkedRequest = [
      /var corkReq = [\s\S]+?(.+?)\.corkedRequestsFree = corkReq/g
    , `$1.corkedRequestsFree = new CorkedRequest($1)`
  ]
  , fixUintStuff = [
      /Stream\.(_isUint8Array|_uint8ArrayToBuffer)\(/g
    , `$1(`
  ]
  , fixBufferCheck = [
      /Object\.getPrototypeOf\((chunk)\) !== Buffer\.prototype/g
    , '!CrossplatformBuffer.isBuffer($1)'
  ]
  , errorsOneLevel = [
        /internal\/errors/
    ,   '../errors'
  ]
  , errorsTwoLevel = [
        /internal\/errors/
    ,   '../../../errors'
  ]
  , warnings = [
        /^const { emitExperimentalWarning } = require\('internal\/util'\);/m,
        'const { emitExperimentalWarning } = require(\'../experimentalWarning\');'
  ]
  , numberIE11 = [
          /Number\.isNaN\(n\)/g
      ,   'n !== n'
  ]
  , integerIE11 = [
          /Number\.isInteger\(hwm\)/g
    ,     '(isFinite(hwm) && Math.floor(hwm) === hwm)'
  ]
  , noAsyncIterators1 = [
          /Readable\.prototype\[Symbol\.asyncIterator\] = function\(\) \{/g
      ,   'if (typeof Symbol === \'function\' ) {\nReadable.prototype[Symbol.asyncIterator] = function () {'
  ]
  , noAsyncIterators2 = [
          /return createReadableStreamAsyncIterator\(this\);\n};/m
      ,   'return createReadableStreamAsyncIterator(this);\n};\n}'
  ]
  , noAsyncIteratorsFrom1 = [
          /Readable\.from = function *\(iterable, opts\) \{/g
      ,   'if (typeof Symbol === \'function\' ) {\nReadable.from = function (iterable, opts) {'
  ]
  , noAsyncIteratorsFrom2 = [
          /return from\(Readable, iterable, opts\);\n};/m
      ,   'return from(Readable, iterable, opts);\n};\n}'
  ]
  , once = [
          /const \{ once \} = require\('internal\/util'\);/
      ,  'function once(callback) { let called = false; return function(...args) { if (called) return; called = true; callback(...args); }; }'
  ]

module.exports['_stream_duplex.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , inherits
  , stringDecoderReplacement
  , objectKeysReplacement
  , objectKeysDefine
  , errorsOneLevel
]

module.exports['_stream_passthrough.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , inherits
  , stringDecoderReplacement
  , errorsOneLevel
]

module.exports['_stream_readable.js'] = [
    addDuplexRequire
  , addDuplexDec
  , requireReplacement
  , instanceofReplacement
  , altIndexOfImplReplacement
  , altIndexOfUseReplacement
  , stringDecoderReplacement
  , debugLogReplacement
  , utilReplacement
  , inherits
  , stringDecoderReplacement
  , eventEmittterReplacement
  , requireStreamReplacement
  , bufferReplacement
  , isBufferReplacement
  , eventEmittterListenerCountReplacement
  , internalDirectory
  , fixUintStuff
  , addUintStuff
  , errorsOneLevel
  , warnings
  , numberIE11
  , noAsyncIterators1
  , noAsyncIterators2
  , noAsyncIteratorsFrom1
  , noAsyncIteratorsFrom2
]

module.exports['_stream_transform.js'] = [
    requireReplacement
  , instanceofReplacement
  , utilReplacement
  , inherits
  , stringDecoderReplacement
  , errorsOneLevel
]

module.exports['_stream_writable.js'] = [
    addDuplexRequire
  , addDuplexDec
  , requireReplacement
  , instanceofReplacement
  , utilReplacement
  , inherits
  , stringDecoderReplacement
  , debugLogReplacement
  , deprecateReplacement
  , objectDefinePropertyReplacement
  , objectDefinePropertySingReplacement
  , bufferIsEncodingReplacement
  , bufferReplacement
  , [ /^var assert = require\('assert'\);$/m, '' ]
  , requireStreamReplacement
  , isBufferReplacement
  , internalUtilReplacement
  , fixInstanceCheck
  , removeOnWriteBind
  , internalDirectory
  , fixUintStuff
  , addUintStuff
  , fixBufferCheck
  , useWriteReq
  , useCorkedRequest
  , addConstructors
  , errorsOneLevel
]

module.exports['internal/streams/buffer_list.js'] = [
    [
      /inspect.custom/g,
      'custom'
    ],
    [
      /const \{ inspect \} = require\('util'\);/,
      `
      /*<replacement>*/
      let CrossplatformUtil;
      if(typeof DenoUtil === "undefined"){
        CrossplatformUtil = require('util');
      }else{
        CrossplatformUtil = DenoUtil;
      }
      /*</replacement>*/
      const { inspect } = CrossplatformUtil;
      const custom = inspect && inspect.custom || 'inspect'
      `
    ]
    , requireBufferReplacement
    , bufferReplacement
]
module.exports['internal/streams/destroy.js'] = [
    errorsTwoLevel
]

module.exports['internal/streams/state.js'] = [
  , errorsTwoLevel
  , integerIE11
]

module.exports['internal/streams/async_iterator.js'] = [
  , errorsTwoLevel
  , [
      /internal\/streams\/end-of-stream/,
      './end-of-stream'
    ]
  , [
      /const AsyncIteratorPrototype = Object\.getPrototypeOf\(\n.*Object\.getPrototypeOf\(async function\* \(\) \{\}\).prototype\);/m,
      'const AsyncIteratorPrototype = Object\.getPrototypeOf(function () {})'
    ]
  , [
      /  return\(\)/,
      '[Symbol.asyncIterator]() { return this },\n  return\(\)'
    ]
]

module.exports['internal/streams/end-of-stream.js'] = [
  , errorsTwoLevel
  , [
    /const \{ once \} = require\('internal\/util'\);/,
    `function once(callback) {
  let called = false;
  return function(...args) {
    if (called) return;
    called = true;
    callback.apply(this, args);
  };
}`
  ]
]

module.exports['internal/streams/pipeline.js'] = [
    once
  , errorsTwoLevel
  , [
      /require\('internal\/streams\/end-of-stream'\)/,
      'require(\'.\/end-of-stream\')'
    ]
]

module.exports['internal/streams/from.js'] = [
    errorsTwoLevel
  , [
        /if \(iterable && iterable\[Symbol.asyncIterator\]\)/
    , `if (iterable && typeof iterable.next === 'function') {
      iterator = iterable
    }
else if (iterable && iterable[Symbol.asyncIterator])`
    ]
]
