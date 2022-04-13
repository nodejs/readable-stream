export const sources = [
  'lib/_stream_.+',
  'lib/internal/errors.js',
  'lib/internal/streams/.+',
  'lib/internal/wrap_js_stream.js',
  'test/parallel/test-stream.+',
  'test/parallel/test-readable.+',
  'test/common/index.js',
  'test/common/tmpdir.js'
]

export const skippedSources = [
  'test/parallel/test-stream2-httpclient-response-end.js',
  'test/parallel/test-stream-base-no-abort.js',
  'test/parallel/test-stream-preprocess.js',
  'test/parallel/test-stream-inheritance.js',
  'test/parallel/test-stream-base-prototype-accessors.js',
  'test/parallel/test-stream-base-prototype-accessors-enumerability.js',
  'test/parallel/test-stream-wrap-drain.js',
  'test/parallel/test-stream-pipeline-http2.js',
  'test/parallel/test-stream-base-typechecking.js'
]

export const aliases = {
  'lib/internal/errors.js': ['lib/internal/errors-browser.js']
}
