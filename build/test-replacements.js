const altForEachImplReplacement = require('./common-replacements').altForEachImplReplacement
    , altForEachUseReplacement  = require('./common-replacements').altForEachUseReplacement
    , altIndexOfImplReplacement = require('./common-replacements').altIndexOfImplReplacement
    , altIndexOfUseReplacement  = require('./common-replacements').altIndexOfUseReplacement

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

]

module.exports['test-stream2-basic.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-objects.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-stderr-sync.js'] = [
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
]

module.exports['test-stream-big-packet.js'] = [
    altIndexOfImplReplacement
  , altIndexOfUseReplacement
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
        /process\.nextTick([^\;]+);/g
      , 'setTimeout($1, 0);'
    ]
]

// just noisy
module.exports['test-stream2-large-read-stall.js'] = [
    [
        /console\.error/g
      , ';false && console.error'
    ]
]

module.exports['common.js'] = [
    [
        /^                      setImmediate,$/m
      , '                      typeof setImmediate == \'undefined\' ? null : setImmediate,'
    ]

  , [
        /^                      clearImmediate,$/m
      , '                      typeof clearImmediate == \'undefined\' ? null : clearImmediate,'
    ]

  , [
        /^                      global];$/m
      , '                      global].filter(Boolean);'
    ]
]

module.exports['test-stream-pipe-cleanup.js'] = [
    [
        /(function Writable\(\) \{)/
      , 'if (/^v0\\.8\\./.test(process.version))\n  return\n\n$1'
    ]
]