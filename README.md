# Grid
[![NPM Version](https://badge.fury.io/js/grid.svg)](https://npmjs.org/package/grid) [![Build Status](https://travis-ci.org/floatdrop/grid.svg)](https://travis-ci.org/floatdrop/grid) [![Dependency Status](https://gemnasium.com/floatdrop/grid.svg)](https://gemnasium.com/floatdrop/grid)

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
