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

    // it('should transmit messages to other client and provide src', function (done) {
    //     var ws = new WS('ws://localhost:' + port);
    //     ws.on('message', function (data) {
    //         var json = JSON.parse(data);
    //         if (json.type === protocol.WELCOME) {
    //             var firstId = json.id;
    //             var ws2 = new WS('ws://localhost:' + port);
    //             ws2.on('message', function (data) {
    //                 var json = JSON.parse(data);
    //                 if (json.type === protocol.WELCOME) {
    //                     ws.send(JSON.stringify({ dst: json.id, payload: 'Hello!' }));
    //                 } else if (json.payload) {
    //                     json.src.should.eql(firstId);
    //                     json.payload.should.eql('Hello!');
    //                     done();
    //                 }  else {
    //                     done('Unexpected message recieved: ' + json);
    //                 }
    //             });
    //         } else {
    //             done('Unexpected message recieved: ' + json);
    //         }
    //     });
    // });
});
