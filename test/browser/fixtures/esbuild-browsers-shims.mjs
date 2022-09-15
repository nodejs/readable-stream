import * as processModule from 'process'

export const process = processModule

export function setImmediate(fn, ...args) {
  setTimeout(() => fn(...args), 1)
}
