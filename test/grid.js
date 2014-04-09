/* global describe, it, beforeEach, afterEach */

'use strict';

var port = 5001;
var WS = require('ws');

describe('server', function () {
    beforeEach(function (done) {
        this.grid = require('..')({port: port}, done);
    });

    afterEach(function () {
        this.grid._server.close();
    });

    it('should start websocket server', function (done) {
        var ws = new WS('ws://localhost:' + port);
        ws.on('open', function () {
            done();
        });
    });

    it('should emit connection when user connects to websocket server', function (done) {
        this.grid.on('connection', function () { done(); });
        var ws = new WS('ws://localhost:' + port);
    });

    it('should emit disconnect when user closes websocket connection', function (done) {
        this.grid.on('disconnect', function () { done(); });
        var ws = new WS('ws://localhost:' + port);
        ws.on('open', function () {
            ws.terminate();
        });
    });
});
