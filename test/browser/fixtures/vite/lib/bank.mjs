import { Readable } from '@me'

/**
 * Returns a Readable stream that reports the content of a buffer
 * @param buffer {Uint8Array}
 * @return {import('stream').Readable}
 */
export function createBankStream(buffer) {
  let bytesRead = 0
  const readable = new Readable()
  readable._read = function (count) {
    let end = bytesRead + count
    let done = false
    if (end >= buffer.byteLength) {
      end = buffer.byteLength
      done = true
    }
    readable.push(buffer.subarray(bytesRead, bytesRead = end))
    if (done) {
      readable.push(null)
    }
  }
  return readable
}
