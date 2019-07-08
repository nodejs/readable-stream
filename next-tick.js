module.exports = nextTick;

function nextTick(...args) {
  process.nextTick(...args);
}
