const { Transform } = require('../lib')

class MyStream extends Transform {
  _transform(chunk, encoding, callback) {
    callback(null, Buffer.from(chunk, encoding).toString('utf-8').toUpperCase())
  }
}

const s = new MyStream()

process.stdin.resume()
process.stdin.pipe(s).pipe(process.stdout)

if (process.stdin.setRawMode) {
  process.stdin.setRawMode(true)
}

process.stdin.on('data', function (c) {
  c = c.toString()

  if (c === '\u0003' || c === '\u0004') {
    process.stdin.pause()
    s.end()
  }

  if (c === '\r') {
    process.stdout.write('\n')
  }
})
