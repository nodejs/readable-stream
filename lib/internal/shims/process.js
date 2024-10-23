/* wraps the internal process module, circumventing issues with some polyfills (see #539) */

/** @type {import('node:process')} */
const process = ((base, esmKey, keys, isValid) => {
  // check if top-level es module, in which case it may have a default export
  if (esmKey in base && base[esmKey] === true) {
    let candidate
    for (const key of keys) {
      if (!(key in base)) {
        continue
      }
      candidate = base[key]
      // sanity check
      if (isValid(candidate)) {
        return candidate
      }
    }
  }
  return base
})(
  require('process/'),
  '__esModule',
  ['default', 'process'],
  (candidate) => 'nextTick' in candidate
)

module.exports = process
