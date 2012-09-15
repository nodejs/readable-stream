'use strict';

// Read n bytes from the supplied list of buffers.
// the length is the sum of all the buffers in the list.

module.exports = fromList;
if(!Buffer.hasOwnProperty('concat')){
	Buffer.concat = function(list, length) {
	  if (!Array.isArray(list)) {
	    throw new Error('Usage: Buffer.concat(list, [length])');
	  }

	  if (list.length === 0) {
	    return new Buffer(0);
	  } else if (list.length === 1) {
	    return list[0];
	  }

	  if (typeof length !== 'number') {
	    length = 0;
	    for (var i = 0; i < list.length; i++) {
	      var buf = list[i];
	      length += buf.length;
	    }
	  }

	  var buffer = new Buffer(length);
	  var pos = 0;
	  for (var i = 0; i < list.length; i++) {
	    var buf = list[i];
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer;
	};
}

function fromList(n, list, length) {
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0) {
    return null;
  }

  if (typeof length === 'undefined') {
    // didn't tell us the length of the list.
    // flatten and proceed from there.
    var buf = Buffer.concat(list);
    length = buf.length;
    list.length = 0;
    list.push(buf);
  }

  if (length === 0) {
    ret = null;
  } else if (!n || n >= length) {
    // read it all, truncate the array.
    ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      ret = new Buffer(n);
      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);
        buf.copy(ret, c, 0, cpy);
        if (cpy < buf.length) {
          list[0] = buf.slice(cpy);
        } else {
          list.shift();
        }
        c += cpy;
      }
    }
  }

  return ret;
}
