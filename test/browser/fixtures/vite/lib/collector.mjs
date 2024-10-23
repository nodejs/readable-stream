import { Writable } from '@me'

const LOAD_FACTOR = 0.75
const INITIAL_CAPACITY = 16

/**
 * Returns a Writable stream that stores chunks to an internal buffer, retrievable with #collect().
 * @returns {import("stream").Writable & { collect(): Uint8Array }}
 */
export function createCollectorStream() {
  let capacity = INITIAL_CAPACITY
  let buffer = new Uint8Array(capacity)
  let size = 0

  // ensures that "buffer" can hold n additional bytes
  function provision(n) {
    const requiredSize = size + n
    if (requiredSize <= capacity) {
      return
    }
    const newCapacity = Math.ceil((requiredSize + 1) / LOAD_FACTOR)
    let arrayBuffer = buffer.buffer
    if ('transfer' in arrayBuffer) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer
      arrayBuffer = arrayBuffer.transfer(newCapacity)
      buffer = new Uint8Array(arrayBuffer)
    } else {
      const copy = new Uint8Array(newCapacity)
      copy.set(buffer, 0)
      buffer = copy
    }
    capacity = newCapacity
  }

  const writable = new Writable()
  writable._write = function (chunk, _, cb) {
    if (!(chunk instanceof Uint8Array)) {
      throw new Error('Unexpected chunk')
    }
    provision(chunk.byteLength)
    buffer.set(chunk, size)
    size += chunk.byteLength
    cb(null)
  }

  return Object.assign(writable, {
    collect: function () {
      return buffer.subarray(0, size)
    }
  })
}
