# Grid
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

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


## Events

### connection(id)

Emitted, when client connects to grid with websockets and recieves id.

### disconnect(id)

Emitted, when client closes websocket connection.

[npm-url]: https://npmjs.org/package/grid
[npm-image]: http://img.shields.io/npm/v/grid.svg

[travis-url]: https://travis-ci.org/GridJS/grid
[travis-image]: http://img.shields.io/travis/GridJS/grid.svg

[depstat-url]: https://gemnasium.com/GridJS/grid
[depstat-image]: https://gemnasium.com/GridJS/grid.svg
