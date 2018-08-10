# readable-stream

***Node.js core streams for userland*** [![Build Status](https://travis-ci.com/nodejs/readable-stream.svg?branch=master)](https://travis-ci.com/nodejs/readable-stream)


[![NPM](https://nodei.co/npm/readable-stream.png?downloads=true&downloadRank=true)](https://nodei.co/npm/readable-stream/)
[![NPM](https://nodei.co/npm-dl/readable-stream.png?&months=6&height=3)](https://nodei.co/npm/readable-stream/)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/readabe-stream.svg)](https://saucelabs.com/u/readabe-stream)

```bash
npm install --save readable-stream
```

This package is a mirror of the streams implementations in Node.js.

Full documentation may be found on the [Node.js website](https://nodejs.org/dist/v10.8.0/docs/api/stream.html).

If you want to guarantee a stable streams base, regardless of what version of
Node you, or the users of your libraries are using, use **readable-stream** *only* and avoid the *"stream"* module in Node-core, for background see [this blogpost](http://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html).

As of version 2.0.0 **readable-stream** uses semantic versioning.

v3.x.x of `readable-stream` supports Node 6, 8, and 10, as well as
evergreen browsers, IE 11 and latest Safari.

v2.x.x of `readable-stream` supports all Node.js version from 0.8, as well as
evergreen browsers and IE 10 & 11.

### Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][sauce]

# Usage

You can swap your `require('stream')` with `require('readable-stream')`
without any changes, if you are just using one of the main classes and
functions.

```js
const {
  Readable,
  Writable,
  Transform,
  Duplex,
  pipeline,
  finished
} = require('readable-stream')
````

Note that `require('stream')` will return `Stream`, while
`require('readable-stream')` will return `Readable`. We discourage using
whatever is exported directly, but rather use one of the properties as
shown in the example above.

# Streams Working Group

`readable-stream` is maintained by the Streams Working Group, which
oversees the development and maintenance of the Streams API within
Node.js. The responsibilities of the Streams Working Group include:

* Addressing stream issues on the Node.js issue tracker.
* Authoring and editing stream documentation within the Node.js project.
* Reviewing changes to stream subclasses within the Node.js project.
* Redirecting changes to streams from the Node.js project to this
  project.
* Assisting in the implementation of stream providers within Node.js.
* Recommending versions of `readable-stream` to be included in Node.js.
* Messaging about the future of streams to give the community advance
  notice of changes.

<a name="members"></a>
## Team Members

* **Chris Dickinson** ([@chrisdickinson](https://github.com/chrisdickinson)) &lt;christopher.s.dickinson@gmail.com&gt;
  - Release GPG key: 9554F04D7259F04124DE6B476D5A82AC7E37093B
* **Calvin Metcalf** ([@calvinmetcalf](https://github.com/calvinmetcalf)) &lt;calvin.metcalf@gmail.com&gt;
  - Release GPG key: F3EF5F62A87FC27A22E643F714CE4FF5015AA242
* **Rod Vagg** ([@rvagg](https://github.com/rvagg)) &lt;rod@vagg.org&gt;
  - Release GPG key: DD8F2338BAE7501E3DD5AC78C273792F7D83545D
* **Sam Newman** ([@sonewman](https://github.com/sonewman)) &lt;newmansam@outlook.com&gt;
* **Mathias Buus** ([@mafintosh](https://github.com/mafintosh)) &lt;mathiasbuus@gmail.com&gt;
* **Domenic Denicola** ([@domenic](https://github.com/domenic)) &lt;d@domenic.me&gt;
* **Matteo Collina** ([@mcollina](https://github.com/mcollina)) &lt;matteo.collina@gmail.com&gt;
  - Release GPG key: 3ABC01543F22DD2239285CDD818674489FBC127E
* **Irina Shestak** ([@lrlna](https://github.com/lrlna)) &lt;shestak.irina@gmail.com&gt;

[sauce]: https://saucelabs.com
