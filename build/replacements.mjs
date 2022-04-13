const legacyStreamsRequireStream = ["require\\('stream'\\)", "require('./stream')"]

const streamsInternalsPrimordials = ['= primordials', "= require('../primordials')"]

const streamsInternalsInspect = [
  "const { inspect } = require\\('internal/util/inspect'\\);",
  "const inspect = { custom: Symbol('nodejs.util.inspect.custom') };"
]

const streamsInternalsRequireStreams = ["require\\('internal/streams/([^']+)'\\)", "require('./$1')"]

const streamsInternalsRequireRelativeUtilDebuglog = ["require\\('internal/util/debuglog'\\)", "require('../../util')"]

const streamsInternalsRequireRelativeInternalUtil = ["require\\('internal/util'\\)", "require('../../util')"]

const streamsInternalsRequireInternal = ["require\\('internal/([^']+)'\\)", "require('../$1')"]

const streamsInternalsRequireRelativeDuplex = ['instanceof Stream.Duplex', "instanceof require('./duplex')"]

const streamsInternalsRequireWebStream = ["require\\('../webstreams/adapters'\\)", '{}']

const streamsInternalNoRequireAbortController = [
  'const \\{ AbortController \\} = .+',
  `
    if (typeof AbortController === 'undefined') {
      globalThis.AbortController = require('abort-controller').AbortController;
    }
  `
]

const streamsInternalWeakHandler = [
  "const \\{ kWeakHandler \\} = require\\('../event_target'\\);",
  "const kWeakHandler = require('../primordials').Symbol('kWeak');"
]

const streamsInternalBlob = [
  "require\\('../blob'\\);",
  `
    {
      isBlob(b) {
        return b instanceof Blob
      }
    }

    const { Blob } = require('buffer');
  `
]

const errorsRequireRelativeInspect = ["require\\('internal/util/inspect'\\)", "require('./inspect')"]

const errorsRequireTty = ["require\\('internal/tty'\\).hasColors\\(\\)", 'false']

const errorsRequireCheckCaptureStackTrace = [
  'ErrorCaptureStackTrace\\(err\\);',
  `
    if (typeof ErrorCaptureStackTrace === 'function') {
      ErrorCaptureStackTrace(err);
    }
  `
]

const inspectSequencesRegExp = [
  'const strEscapeSequencesRegExp = .+',
  'const strEscapeSequencesRegExp = /[\\x00-\\x1f\\x27\\x5c\\x7f-\\x9f]/;'
]

const inspectSequencesReplacer = [
  'const strEscapeSequencesReplacer = .+',
  'const strEscapeSequencesReplacer = /[\\x00-\\x1f\\x27\\x5c\\x7f-\\x9f]/g'
]

const inspectSequencesRegExpSingle = [
  'const strEscapeSequencesRegExpSingle = .+',
  'const strEscapeSequencesRegExpSingle = /[\\x00-\\x1f\\x5c\\x7f-\\x9f]/;'
]

const inspectSequencesReplacerSingle = [
  'const strEscapeSequencesReplacerSingle = .+',
  'const strEscapeSequencesReplacerSingle = /[\\x00-\\x1f\\x5c\\x7f-\\x9f]/g;'
]

const inspectLookBehind = ['\\(\\?[<=]', '(?:']

const internalsRequireAssert = ["require\\('internal/assert'\\)", "require('assert')"]

const inspectNativeModule = [
  "require\\('internal/bootstrap/loaders'\\);",
  `
    {
      NativeModule: { 
        exists() {
          return false;
        }
      }
    }
  `
]

const inspectIntl = ["internalBinding\\('config'\\)\\.hasIntl", 'false']

const inspectIcuBinding = ["internalBinding\\('icu'\\)", '{}']

const streamSocketInspectBinding = ['internalBinding', 'process.binding']

const streamSocketDebugLog = ["require\\('internal/util/debuglog'\\)", "require('../util')"]

const inspectRequireUtil = ["internalBinding\\('util'\\)", "require('../util')"]

const internalRequireRelativeInternalUtil = ["require\\('internal/util'\\)", "require('../util')"]

const internalRequireRelativeInternal = ["require\\('internal/([^']+)'\\)", "require('./$1')"]

const internalRequireAsyncHooks = ["require\\('./async_hooks'\\)", "require('internal/async_hooks')"]

const internalPrimordials = ['= primordials', "= require('./primordials')"]

const internalRequireRelativeTypes = ["require\\('internal/util/types'\\)", "require('../util')"]

const internalNoCoalesceAssignment = [
  '\\s*(.+) \\?\\?= (.+)',
  `
    if (typeof $1 === 'undefined') {
      $1 = $2
    }
  `
]

const primordialsDefine = [
  "('use strict';)",
  `
    $1

    const primordials = module.exports = {}
  `
]

const primordialsAggregateError = [
  '(= Reflect;)',
  `
    $1

    if (typeof AggregateError === 'undefined') {
      globalThis.AggregateError = require('aggregate-error');
    }
  `
]

const validatorSignals = ["const \\{ signals \\} = internalBinding\\('constants'\\).os;", 'const signals = {};']

const streamIndexPrimordials = ['= primordials', "= require('./internal/primordials')"]

const streamIndexRequireUtil = ["require\\('internal/util'\\)", "require('./util')"]

const streamIndexRequireInternalBuffer = ["require\\('internal/buffer'\\)", '{}']

const streamIndexIsUint8Array = [
  "Stream._isUint8Array = require\\('internal/util/types'\\).isUint8Array;",
  `
    Stream._isUint8Array = function isUint8Array(value) { 
      return value instanceof Uint8Array 
    };
  `
]

const streamIndexRequireInternal = ["require\\('internal/([^']+)'\\)", "require('./internal/$1')"]

const streamIndexRequirePromises = ["require\\('stream/promises'\\);", "require('./stream/promises');"]

const streamIndexUint8ArrayToBuffer = ['new internalBuffer.FastBuffer', 'Buffer.from']

const streamsPrimordials = ['= primordials', "= require('../internal/primordials')"]

const streamsRequireInternal = ["require\\('internal/(.+)'\\)", "require('../internal/$1')"]

const streamsConsumerTextDecoder = ["const \\{\\n\\s+TextDecoder,\\n\\} = require\\('../internal/encoding'\\);\\n", '']

const streamsConsumerNoRequireBlob = ["const \\{\\n\\s+Blob,\\n\\} = require\\('../internal/blob'\\);\\n", '']

const streamsConsumerRequireBlobFromBuffer = ['(\\s+Buffer,)', '$1 Blob,']

const webstreamPrimordials = ['= primordials', "= require('../primordials')"]

const webstreamsRequireRelative = ["require\\('internal/webstreams/([^']+)'\\)", "require('./$1')"]

const webstreamsRequireStreams = ["require\\('internal/streams/([^']+)'\\)", "require('../streams/$1')"]

const webstreamsRequireStream = ["require\\('stream'\\)", "require('../../stream')"]

const webstreamsRequireUtil = ["require\\('internal/util'\\)", "require('../../util')"]

const webstreamsRequireErrorsOrValidators = ["require\\('internal/(errors|validators)'\\)", "require('../$1')"]

const webstreamsConsumerNoRequireTextAPI = [
  "const \\{\\n\\s+TextDecoder,\\n\\s+TextEncoder,\\n\\} = require\\('internal/encoding'\\);\\n",
  ''
]

const testParallelIncludeTap = [
  "('use strict')",
  `
    $1

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  `
]

const testParallelRequireStream = ["require\\('stream'\\)", "require('../../lib')"]

const testParallelRequireStreamPromises = ["require\\('stream/promises'\\)", "require('../../lib/stream/promises')"]

const testParallelRequireStreamConsumer = ["require\\('stream/consumer'\\)", "require('../../lib/stream/consumer')"]

const testParallelRequireStreamWeb = ["require\\('stream/web'\\)", "require('../../lib/stream/web')"]

const testParallelRequireStreamInternalsLegacy = ["require\\('(_stream_\\w+)'\\)", "require('../../lib/$1')"]

const testParallelRequireStreamInternals = ["require\\('(internal/.+)'\\)", "require('../../lib/$1')"]

const testParallelImportStreamInMjs = [" from 'stream';", "from '../../lib/index.js';"]

const testParallelImportTapInMjs = ["(from 'assert';)", "$1\nimport tap from 'tap';"]

const testParallelSilentConsole = ['console.(log|error)', 'silentConsole.$1']

const testParallelHasOwn = ['Object.hasOwn\\(', 'Reflect.has(']

const testParallelBindings = [
  "const \\{ internalBinding \\} = require\\('../../lib/internal/test/binding'\\);",
  'const internalBinding = process.binding'
]

const testParallelTimersPromises = [
  "const { setTimeout } = require\\('timers/promises'\\);",
  `
    const st = require('timers').setTimeout;

    function setTimeout(ms) {
      return new Promise(resolve => {
        st(resolve, ms);
      });
    }
  `
]

const testKnownGlobals = [
  'let knownGlobals = \\[(\\n\\s+)',
  `
    let knownGlobals = [\n
      typeof AggregateError !== 'undefined' ? AggregateError : require('aggregate-error'),
      typeof AbortController !== 'undefined' ? AbortController : require('abort-controller').AbortController,
      typeof AbortSignal !== 'undefined' ? AbortSignal : require('abort-controller').AbortSignal,
      typeof EventTarget !== 'undefined' ? EventTarget : require('event-target-shim').EventTarget,
  `
]

const testTicksReenableConsoleLog = ['silentConsole.log\\(i\\);', 'console.log(i);']

const testTickSaveHook = ['async_hooks.createHook\\(\\{', 'const hook = async_hooks.createHook({']

const testReadableBufferListInspect = [
  'assert.strictEqual\\(\\n\\s+util.inspect\\(\\[ list \\], \\{ compact: false \\}\\),\\n\\s+`\\[\\n\\s+BufferList \\{\\n\\s+head: \\[Object\\],\\n\\s+tail: \\[Object\\],\\n\\s+length: 4\\n\\s+\\}\\n\\]`\\);',
  `
    assert.strictEqual(typeof list.head, 'object');
    assert.strictEqual(typeof list.tail, 'object');
    assert.strictEqual(list.length, 4);
  `
]

const testFinishedEvent = ["res.on\\('close", "res.on('finish"]
const testPreprocessWinLineSeparator = [
  'assert.strictEqual\\(streamedData, modelData\\);',
  "assert.strictEqual(streamedData, process.platform === 'win32' ? modelData.replace(/\\r\\n/g, '\\n') : modelData);"
]

const testFlatMapWinLineSeparator = [
  "'xyz\\\\n'\\.repeat\\(5\\)",
  "(process.platform === 'win32' ? 'xyz\\r\\n' : 'xyz\\n').repeat(5)"
]

const readmeInfo = ['(This package is a mirror of the streams implementations in Node.js) (\\d+.\\d+.\\d+).', '$1 $2.']

const readmeLink = ['(\\[Node.js website\\]\\(https://nodejs.org/dist/v)(\\d+.\\d+.\\d+)', '$1$2']

export const replacements = {
  'lib/_stream.+': [legacyStreamsRequireStream],
  'lib/internal/streams/.+': [
    streamsInternalsPrimordials,
    streamsInternalsInspect,
    streamsInternalsRequireStreams,
    streamsInternalsRequireRelativeUtilDebuglog,
    streamsInternalsRequireRelativeInternalUtil,
    streamsInternalsRequireInternal,
    streamsInternalsRequireRelativeDuplex,
    streamsInternalsRequireWebStream,
    streamsInternalNoRequireAbortController,
    streamsInternalWeakHandler,
    streamsInternalBlob
  ],
  'lib/internal/errors': [errorsRequireRelativeInspect, errorsRequireTty, errorsRequireCheckCaptureStackTrace],
  'lib/internal/inspect.js': [inspectNativeModule, inspectIntl, inspectIcuBinding, inspectRequireUtil],
  'lib/internal/inspect-browser.js': [
    inspectNativeModule,
    inspectIntl,
    inspectIcuBinding,
    inspectRequireUtil,
    inspectSequencesRegExp,
    inspectSequencesReplacer,
    inspectSequencesRegExpSingle,
    inspectSequencesReplacerSingle,
    inspectLookBehind
  ],
  'lib/internal/js_stream_socket.js': [streamSocketInspectBinding, streamSocketDebugLog],
  'lib/internal/primordials.js': [primordialsDefine, primordialsAggregateError],
  'lib/internal/validators.js': [validatorSignals],
  'lib/internal/webstreams/.+': [
    webstreamPrimordials,
    webstreamsRequireRelative,
    webstreamsRequireStreams,
    webstreamsRequireStream,
    webstreamsRequireUtil,
    webstreamsRequireErrorsOrValidators,
    webstreamsConsumerNoRequireTextAPI
  ],
  // Keep this after all the rest in the same folder
  'lib/internal/(?:errors|inspect|inspect-browser|js_stream_socket|primordials|validators).js': [
    internalsRequireAssert,
    internalRequireRelativeTypes,
    internalRequireRelativeInternalUtil,
    internalRequireRelativeInternal,
    internalRequireAsyncHooks,
    internalPrimordials,
    internalNoCoalesceAssignment
  ],
  'lib/stream.js': [
    streamIndexPrimordials,
    streamIndexRequireInternalBuffer,
    streamIndexIsUint8Array,
    streamIndexUint8ArrayToBuffer,
    streamIndexRequireUtil,
    streamIndexRequireInternal,
    streamIndexRequirePromises
  ],
  'lib/stream/.+': [streamsPrimordials, streamsRequireInternal],
  'lib/stream/consumers.js': [
    streamsConsumerTextDecoder,
    streamsConsumerNoRequireBlob,
    streamsConsumerRequireBlobFromBuffer
  ],
  'test/common/index.js': [testKnownGlobals],
  'test/parallel/.+': [
    testParallelIncludeTap,
    testParallelRequireStream,
    testParallelRequireStreamPromises,
    testParallelRequireStreamConsumer,
    testParallelRequireStreamWeb,
    testParallelRequireStreamInternalsLegacy,
    testParallelRequireStreamInternals,
    testParallelImportTapInMjs,
    testParallelImportStreamInMjs,
    testParallelSilentConsole,
    testParallelHasOwn,
    testParallelBindings,
    testParallelTimersPromises
  ],
  'test/parallel/test-stream-finished.js': [testFinishedEvent],
  'test/parallel/test-stream-flatMap.js': [testFlatMapWinLineSeparator],
  'test/parallel/test-stream-preprocess.js': [testPreprocessWinLineSeparator],
  'test/parallel/test-stream-writable-samecb-singletick.js': [testTicksReenableConsoleLog, testTickSaveHook],
  'test/parallel/test-stream2-readable-from-list.js': [testReadableBufferListInspect],
  'README.md': [readmeInfo, readmeLink]
}
