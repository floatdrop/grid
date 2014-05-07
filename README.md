# Grid
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

Grid - is signaling server for organizing distributed network over WebRTC protocol between browsers.

## Standalone server

```js
var grid = require('grid');

var server = grid({
    port: 8080
});
```

### Combining with existing express app

WebSocket server needs server instance to bootup, so we should create express app, then get server from `listen` method and only after that bind PeerServer to express application.

```javascript
var express = require('express');
var app = express();
var grid = require('grid');

app.get('/', function (req, res, next) { res.send('Hello world!'); });

var server = app.listen(8080);

app.use(grid({ server: server, path: '/api' }));
```

### API

Documentation on API coming soon.

[npm-url]: https://npmjs.org/package/grid
[npm-image]: http://img.shields.io/npm/v/grid.svg

[travis-url]: https://travis-ci.org/GridJS/grid
[travis-image]: http://img.shields.io/travis/GridJS/grid.svg

[depstat-url]: https://gemnasium.com/GridJS/grid
[depstat-image]: https://gemnasium.com/GridJS/grid.svg
