export const sources = [
  'lib/_stream_.+',
  'lib/internal/streams/.+',
  'lib/internal/validators.js',
  'lib/stream.js',
  'lib/stream/promises.js',
  'test/common/fixtures.js',
  'test/common/fixtures.mjs',
  'test/common/index.js',
  'test/common/index.mjs',
  'test/common/tmpdir.js',
  'test/fixtures/[^/]+.txt',
  'test/parallel/test-readable.+',
  'test/parallel/test-stream.+'
]

export const skippedSources = [
  'lib/_stream_wrap.js',
  'test/parallel/test-stream-consumers.js',
  'test/parallel/test-stream-destroy.js',
  'test/parallel/test-stream-duplex.js',
  'test/parallel/test-stream-readable-strategy-option.js',
  'test/parallel/test-stream-map.js',
  'test/parallel/test-stream-pipeline.js',
  'test/parallel/test-stream-readable-async-iterators.js',
  'test/parallel/test-stream-wrap-drain.js',
  'test/parallel/test-stream-wrap-encoding.js',
  'test/parallel/test-stream-wrap.js',
  'test/parallel/test-stream-toWeb-allows-server-response.js',
  'test/parallel/test-readable-from-web-enqueue-then-close.js'
]

export const aliases = {}
