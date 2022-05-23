import * as bufferModule from 'buffer-es6'
import * as processModule from 'process-es6'

export const process = processModule
export const Buffer = bufferModule.Buffer

export function setImmediate(fn, ...args) {
  setTimeout(() => fn(...args), 1)
}
