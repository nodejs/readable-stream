# readable-stream

***Node-core streams for userland***


[![Build Status](https://travis-ci.org/nodejs/readable-stream.svg)](https://travis-ci.org/nodejs/readable-stream)
[![NPM](https://nodei.co/npm/readable-stream.png?downloads=true&downloadRank=true)](https://nodei.co/npm/readable-stream/)
[![NPM](https://nodei.co/npm-dl/readable-stream.png?&months=6&height=3)](https://nodei.co/npm/readable-stream/)

```bash
npm install --save readable-stream
```

***Node-core streams for userland***

This package is a mirror of the Streams2 and Streams3 implementations in
Node-core.

If you want to guarantee a stable streams base, regardless of what version of
Node you, or the users of your libraries are using, use **readable-stream** *only* and avoid the *"stream"* module in Node-core.

**readable-stream** versions are pegged to the iojs version they derive from so
2.2.1 would correspond to the streams from 2.2.1.
