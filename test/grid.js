/* global describe, it, beforeEach, afterEach */

'use strict';

var port = 5001;
var WS = require('ws');
var Message = require('grid-protocol').Messages;

require('should');

describe('grid', function () {
    beforeEach(function (done) {
        this.grid = require('..')({port: ++port}, done);
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
        new WS('ws://localhost:' + port);
    });

    it('should emit disconnect when user closes websocket connection', function (done) {
        this.grid.on('disconnect', function () { done(); });
        var ws = new WS('ws://localhost:' + port);
        ws.on('open', function () {
            ws.terminate();
        });
    });

    it('should emit messages that server recieves', function (done) {
        this.grid.on('message', function () { done(); });
        var ws = new WS('ws://localhost:' + port);
        ws.on('open', function () {
            ws.send((new Message('user')).toBuffer());
        });
    });

    it('should warn about unknown destination', function (done) {
        this.grid.on('warn', function (warn) {
            warn.should.match(/unknown destination: user/);
            done();
        });
        var ws = new WS('ws://localhost:' + port);
        ws.on('open', function () {
            ws.send((new Message('user')).toBuffer());
        });
    });

    it('should transmit messages to myself', function (done) {
        var ws = new WS('ws://localhost:' + port);
        ws.on('message', function (data) {
            var msg = Message.decode(data);
            if (msg.type === 'WELCOME') {
                ws.send((new Message(msg.id, 'Hello!')).toBuffer());
            } else {
                msg.data.should.eql('Hello!');
                done();
            }
        });
    });

    it('should broadcast connected event', function (done) {
        var ws = new WS('ws://localhost:' + port);
        ws.on('message', function (data) {
            var m1 = Message.decode(data);
            if (m1.type === 'CONNECTED') {
                done();
            }
        });

        var ws1 = new WS('ws://localhost:' + port);
        ws1.on('message', function (data) {
            var m2 = Message.decode(data);
            if (m2.type === 'CONNECTED') {
                done('Broadcasted to itself');
            }
        });
    });

    it('should broadcast disconnected event', function (done) {
        var ws = new WS('ws://localhost:' + port);
        ws.on('message', function (data) {
            var m1 = Message.decode(data);
            if (m1.type === 'DISCONNECTED') {
                done();
            }
        });

        var ws1 = new WS('ws://localhost:' + port);
        ws1.on('open', function () {
            ws1.terminate();
        });
    });

    it('should transmit messages to other client and provide src', function (done) {
        var ws = new WS('ws://localhost:' + port);
        ws.on('message', function (data) {
            var m1 = Message.decode(data);
            if (m1.type === 'WELCOME') {
                var firstId = m1.id;
                var ws2 = new WS('ws://localhost:' + port);
                ws2.on('message', function (data) {
                    var m2 = Message.decode(data);
                    if (m2.type === 'WELCOME') {
                        ws.send((new Message(firstId, 'Hello!')).toBuffer());
                    }
                });
            } else if (!m1.type) {
                m1.data.should.eql('Hello!');
                done();
            }
        });
    });
});
