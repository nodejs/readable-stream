'use strict'

/* wraps the internal process module, circumventing issues with some polyfills (see #539) */
const process = ((base, esmKey, keys, isValid) => {
  if (esmKey in base && base[esmKey] === true) {
    let candidate
    for (const key of keys) {
      if (!(key in base)) {
        continue
      }
      candidate = base[key]
      if (isValid(candidate)) {
        return candidate
      }
    }
  }
  return base
})(require('process/'), '__esModule', ['default', 'process'], (candidate) => 'nextTick' in candidate)
module.exports = process
