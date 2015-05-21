# io-stream

[![Build Status](https://travis-ci.org/calvinmetcalf/io-stream.svg)](https://travis-ci.org/calvinmetcalf/io-stream)

```bash
npm install --save io-stream
```

***Node/iojs-core streams for userland***

This package is a mirror of the Streams in IOJS.

If you want to guarantee a stable streams base, regardless of what version of iojs you, or the users of your libraries are using, use **io-stream** *only* and avoid the *"stream"* module in iojs-core.

**io-stream** versions are pegged to iojs versions so 1.7.1 would corispond to the streams from 1.7.1.

This packaeg is forked from readable-stream and may end up being merged back in.
