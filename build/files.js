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
            return 'instanceof require(\'./_stream_' + streamType.toLowerCase() + '\')'
          }
      ]
      // use the string_decoder in node_modules rather than core
    , stringDecoderReplacement = [
          /(require\(['"])(string_decoder)(['"]\))/g
        , '$1$2/$3'
      ]

module.exports['_stream_duplex.js'] = [
    requireReplacement
  , instanceofReplacement
  , stringDecoderReplacement
]

module.exports['_stream_passthrough.js'] = [
    requireReplacement
  , instanceofReplacement
  , stringDecoderReplacement
]

module.exports['_stream_readable.js'] = [
    requireReplacement
  , instanceofReplacement
  , stringDecoderReplacement

  , [
        /(require\('events'\)\.EventEmitter;)/
      ,   '$1\n'
        + 'if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {\n'
        + '  return emitter.listeners(type).length;\n'
        + '};'
    ]

  , [
        /(if \(state\.decoder && !state\.ended)(\) \{)/
      , '$1 && state.decoder.end$2'
    ]

]

module.exports['_stream_transform.js'] = [
    requireReplacement
  , instanceofReplacement
  , stringDecoderReplacement
]

module.exports['_stream_writable.js'] = [
    requireReplacement
  , instanceofReplacement
  , stringDecoderReplacement
]