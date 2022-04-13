const streamWritable = `
/* replacement start */
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
/* replacement end */
`

const streamLegacy = `
/* replacement start */
Stream._uint8ArrayToBuffer = function(chunk) {
  return Buffer.from(chunk);
}
Stream._isUint8Array = function(obj) {
  return Buffer.isBuffer(obj) || obj instanceof Uint8Array;
}
/* replacement end */
`

const testParallel = `
/* replacement start */
process.on('beforeExit', (code) => {
  if(code === 0) {
    tap.pass('test succeeded');
  } else {
    tap.fail(\`test failed - exited code \${code}\`);
  }
});
/* replacement end */
`

export const footers = {
  'lib/_stream_writable.js': streamWritable,
  'lib/internal/streams/legacy.js': streamLegacy,
  'test/parallel/.+': testParallel
}
