'use strict';

var WebSocketServer = require('ws').Server;
var uuid = require('node-uuid');
var cors = require('cors');
var Message = require('grid-protocol').Messages;

exports = module.exports = {};

exports.connectionHandler = function (id, socket) {
    if (this._clients[id]) {
        throw new Error('Client with id ' + id + ' already exist!');
    }
    this._clients[id] = {};
    this._sockets[id] = socket;
};

exports.disconnectHandler = function (id) {
    if (this._clients[id]) {
        delete this._clients[id];
    }
    if (this._clients[id]) {
        delete this._sockets[id];
    }
};

exports._initializeHandlers = function () {
    this.on('connection', this.connectionHandler.bind(this));
    this.on('disconnect', this.disconnectHandler.bind(this));
};

exports._initializeWSS = function () {
    var self = this;

    this._wss = new WebSocketServer({ path: this.options.path, server: this._server});
    this._wss.on('connection', function (socket) {
        var id = uuid.v4();
        self.emit('connection', id, socket);
        socket.on('close', function () {
            self.emit('disconnect', id);
        });

        var msg = new Message.Welcome(id);
        socket.send(msg.toArrayBuffer());

        socket.on('message', function (data, flags) {
            if (!flags.binary) {
                return self.emit('error', new Error('Incoming message is not binary: ' + data));
            }

            var message;
            try {
                message = Message.decode(data);
            } catch (e) {
                return self.emit('error', new Error('Malformed message from ' + id));
            }

            message.source = id;

            self.emit('message', message);

            var destination = message.dest;

            if (self._sockets[destination]) {
                self._sockets[destination].send((new Message(destination, message.data, id)).toBuffer());
            } else {
                self.emit('warn', id + ' tryd to send to unknown destination: ' + destination);
            }
        });
    });
};

exports._initializeHTTP = function () {
    this.use(require('body-parser')({ mapParams: false }));
    this.use(cors());
};
