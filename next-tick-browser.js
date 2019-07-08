module.exports = nextTick;

function nextTick(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  setTimeout(function () {
    fn.apply(null, args);
  }, 0);
}
