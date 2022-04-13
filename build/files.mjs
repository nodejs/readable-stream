export const sources = [
  'lib/_stream_.+',
  'lib/internal/errors.js',
  'lib/internal/per_context/primordials.js',
  'lib/internal/streams/.+',
  'lib/internal/util/inspect.js',
  'lib/internal/validators.js',
  'lib/internal/js_stream_socket.js',
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
  'test/parallel/test-stream-consumers.js',
  'test/parallel/test-stream-destroy.js',
  'test/parallel/test-stream-map.js',
  'test/parallel/test-stream-pipeline.js',
  'test/parallel/test-stream-readable-async-iterators.js'
]

export const aliases = {
  'lib/internal/per_context/primordials.js': ['lib/internal/primordials.js'],
  'lib/internal/util/inspect.js': ['lib/internal/inspect.js', 'lib/internal/inspect-browser.js']
}
