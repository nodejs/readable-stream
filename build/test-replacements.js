const altForEachImplReplacement = require('./common-replacements').altForEachImplReplacement
    , altForEachUseReplacement  = require('./common-replacements').altForEachUseReplacement
    , altIndexOfImplReplacement = require('./common-replacements').altIndexOfImplReplacement
    , altIndexOfUseReplacement  = require('./common-replacements').altIndexOfUseReplacement
    , objectKeysDefine =
    require('./common-replacements').objectKeysDefine
    , objectKeysReplacement =
    require('./common-replacements').objectKeysReplacement
    , bufferShimFix =
    require('./common-replacements').bufferShimFix
    , bufferStaticMethods =
    require('./common-replacements').bufferStaticMethods

module.exports.all = [
    [
        /require\(['"]stream['"]\)/g
      , 'require(\'../../\')'
    ]

    // some tests need stream.Stream but readable.js doesn't offer that
    // and we've undone it with the previous replacement

  , [
        /stream\.Stream|require\('\.\.\/\.\.\/'\)\.Stream/g
      , 'require(\'stream\').Stream'
    ]

  , [
        /require\(['"](_stream_\w+)['"]\)/g
      , 'require(\'../../lib/$1\')'
    ]

  , [
        /Stream.(Readable|Writable|Duplex|Transform|PassThrough)/g
      , 'require(\'../../\').$1'
    ]
  , bufferShimFix
  , bufferStaticMethods
  ,   [
        /require\(['"]assert['"]\)/g
      , 'require(\'assert/\')'
    ]
]

module.exports['test-stream2-basic.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-objects.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-transform.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-writable.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
  , [
    /'latin1',/g,
    '\'binary\','
  ]
]

module.exports['test-stream-big-packet.js'] = [
    altIndexOfImplReplacement
  , altIndexOfUseReplacement
]

module.exports['common.js'] = [
    objectKeysDefine
  , objectKeysReplacement
  , altForEachImplReplacement
  , altForEachUseReplacement

  , [
        /(exports.mustCall[\s\S]*)/m
      ,   '$1\n'
        + 'if (!util._errnoException) {\n'
        + '  var uv;\n'
        + '  util._errnoException = function(err, syscall) {\n'
        + '    if (util.isUndefined(uv)) try { uv = process.binding(\'uv\'); } catch (e) {}\n'
        + '    var errname = uv ? uv.errname(err) : \'\';\n'
        + '    var e = new Error(syscall + \' \' + errname);\n'
        + '    e.code = errname;\n'
        + '    e.errno = errname;\n'
        + '    e.syscall = syscall;\n'
        + '    return e;\n'
        + '  };\n'
        + '}\n'
    ]

    // for streams2 on node 0.11
    // and dtrace in 0.10
    // and coverage in all
  , [
        /^(  for \(var x in global\) \{|function leakedGlobals\(\) \{)$/m
      ,   '  /*<replacement>*/\n'
        + '  if (typeof constructor == \'function\')\n'
        + '    knownGlobals.push(constructor);\n'
        + '  if (typeof DTRACE_NET_SOCKET_READ == \'function\')\n'
        + '    knownGlobals.push(DTRACE_NET_SOCKET_READ);\n'
        + '  if (typeof DTRACE_NET_SOCKET_WRITE == \'function\')\n'
        + '    knownGlobals.push(DTRACE_NET_SOCKET_WRITE);\n'
        + '  if (global.__coverage__)\n'
        + '    knownGlobals.push(__coverage__);\n'
        + '\'core,__core-js_shared__,Promise,Map,Set,WeakMap,WeakSet,Reflect,System,asap,Observable,regeneratorRuntime,_babelPolyfill\'.split(\',\').filter(function (item) {  return typeof global[item] !== undefined}).forEach(function (item) {knownGlobals.push(global[item])})'
        + '  /*</replacement>*/\n\n$1'
    ]

    // for node 0.8
  , [
        /^/
      ,   '/*<replacement>*/'
        + '\nif (!global.setImmediate) {\n'
        + '  global.setImmediate = function setImmediate(fn) {\n'

        + '    return setTimeout(fn.bind.apply(fn, arguments), 4);\n'
        + '  };\n'
        + '}\n'
        + 'if (!global.clearImmediate) {\n'
        + '  global.clearImmediate = function clearImmediate(i) {\n'
        + '  return clearTimeout(i);\n'
        + '  };\n'
        + '}\n'
        + '/*</replacement>*/\n'
    ]
  , [
        /^if \(global\.ArrayBuffer\) \{([^\}]+)\}$/m
      ,   '/*<replacement>*/if (!process.browser) {'
        + '\nif \(global\.ArrayBuffer\) {$1}\n'
        + '}/*</replacement>*/\n'
    ]
    , [
          /^Object\.defineProperty\(([\w\W]+?)\}\)\;/mg
        ,   '/*<replacement>*/if (!process.browser) {'
          + '\nObject\.defineProperty($1});\n'
          + '}/*</replacement>*/\n'
      ]
    , [
      /if \(!process\.send\)/
      , 'if (!process.send && !process.browser)'
    ]
    , [
      /^/,
      `/*<replacement>*/
      require('babel-polyfill');
      var util = require('util');
      for (var i in util) exports[i] = util[i];
      /*</replacement>*/`
    ],
    [
      /var regexp = `\^\(\\\\w\+\)\\\\s\+\\\\s\$\{port\}\/\$\{protocol\}\\\\s`;/,
      `var regexp = '^(\\w+)\\s+\\s' + port + '/' + protocol + '\\s';`
    ],
    [
        /require\(['"]stream['"]\)/g
      , 'require(\'../\')'
    ],
    [
    /^var util = require\('util'\);/m
  ,   '\n/*<replacement>*/\nvar util = require(\'core-util-is\');\n'
    + 'util.inherits = require(\'inherits\');\n/*</replacement>*/\n'
  ],
  [
  /^const util = require\('util'\);/m
,   '\n/*<replacement>*/\nvar util = require(\'core-util-is\');\n'
  + 'util.inherits = require(\'inherits\');\n/*</replacement>*/\n'
]
, [
  /process\.binding\('timer_wrap'\)\.Timer;/,
  '{now: function (){}}'
],
[
  /(exports\.enoughTestCpu[^;]+;)/,
  '/*$1*/'
],
[
  /exports\.buildType/,
  '//exports.buildType'
]
]

// this test has some trouble with the nextTick depth when run
// to stdout, it's also very noisy so we'll quiet it
module.exports['test-stream-pipe-multi.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
  , [
        /console\.error/g
      , '//console.error'
    ]

  , [
        /process\.nextTick/g
      , 'setImmediate'
    ]
]

// just noisy
module.exports['test-stream2-large-read-stall.js'] = [
    [
        /console\.error/g
      , ';false && console.error'
    ]
]

module.exports['test-stream-pipe-cleanup.js'] = [
    [
        /(function Writable\(\) \{)/
      , '(function (){\nif (/^v0\\.8\\./.test(process.version))\n  return\n\n$1'
    ]
    ,
    [
      /$/
      ,'}())'
    ]
]

module.exports['test-stream2-stderr-sync.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
  , [
        // 'tty_wrap' is too different across node versions.
        // this bypasses it and replicates a console.error() test
        /(function child0\(\) \{)/
      ,   '$1\n'
        + '  return console.error(\'child 0\\nfoo\\nbar\\nbaz\');\n'
    ]
]

module.exports['test-stream-unshift-read-race.js'] = [
  [
    /data\.slice\(pos, pos \+ n\)/g,
    'data.slice(pos, Math.min(pos + n, data.length))'
  ]
]

module.exports['test-stream-pipe-without-listenerCount.js'] = [
  [
    /require\(\'stream\'\)/g,
    'stream'
  ]
]

module.exports['test-stream2-readable-empty-buffer-no-eof.js'] = [
  [
    `const buf = Buffer(5).fill('x');`,
    `const buf = new Buffer(5);
  buf.fill('x');`
  ]
]

module.exports['test-stream2-unpipe-drain.js'] = [
  [
    /^/,
    `(function () {\n`
  ],
  [
    /$/
    ,'}())'
  ]
]

module.exports['test-stream2-decode-partial.js'] = [
 [
   /readable\.push\(source\.slice\(4, 6\)\)/
  ,`readable.push(source.slice(4, source.length));`
 ]
]


module.exports['test-stream3-cork-uncork.js'] = module.exports['test-stream3-cork-end.js'] = [
  [
    /assert\.ok\(seen\.equals\(expected\)\);/,
    'assert.deepEqual(seen, expected);'
  ]
]
module.exports['test-stream2-readable-from-list.js'] = [
  [
    /require\('internal\/streams\/BufferList'\)/,
    'require(\'../../lib/internal/streams/BufferList\')'
  ]
]
module.exports['test-stream-writev.js'] = [
  [
    /'latin1'/g,
    `'binary'`
  ]
]
module.exports['test-stream2-readable-empty-buffer-no-eof.js'] = [
  [
    /case 3:\n(\s+)setImmediate\(r\.read\.bind\(r, 0\)\);/,
    'case 3:\n$1setTimeout(r.read.bind(r, 0), 50);'
  ]
]
module.exports['test-stream-buffer-list.js'] = [
  [
    /require\('internal\/streams\/BufferList'\);/,
    'require(\'../../lib/internal/streams/BufferList\');'
  ]
]
