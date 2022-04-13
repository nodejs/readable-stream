import { createReadStream } from 'node:fs'
import { Readable } from '../lib/index.js'

const fst = createReadStream(new URL(import.meta.url).pathname)
const rst = new Readable()

rst.wrap(fst)

rst.on('end', function () {
  process.stdin.pause()
})

console.log("Every time you press a key, you will see more contents of the source file. Let's begin!\n\n")
process.stdin.setRawMode(true)
process.stdin.on('data', function () {
  const c = rst.read(25)
  if (!c) {
    return setTimeout(process.exit, 500)
  }
  process.stdout.write(c)
})
process.stdin.resume()
