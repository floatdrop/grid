'use strict';

var WebSocketServer = require('ws').Server;
var uuid = require('node-uuid');
var cors = require('cors');
var protocol = require('./protocol.js');

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

        socket.send(protocol.welcome(id));

        socket.on('message', function (data, flags) {
            self.emit('message', data, flags);

            var message;
            try {
                message = JSON.parse(data);
            } catch (e) {
                return self.emit('error', new Error('Malformed message from ' + id + ': ' + data));
            }

            message.src = id;
            var destanation = message.dst;

            if (!destanation) {
                return self.emit('error', new Error('Malformed message from ' + id + ': ' + data));
            }

            data = JSON.stringify(message);

            if (self._sockets[destanation]) {
                self._sockets[destanation].send(data, { binary: flags.binary, mask: flags.masked });
            } else {
                self.emit('warn', id + ' tryd to send to unknown destanation: ' + destanation);
            }
        });
    });
};

exports._initializeHTTP = function () {
    this.use(require('body-parser')({ mapParams: false }));
    this.use(cors());
};
