'use strict';

var WebSocketServer = require('ws').Server;
var uuid = require('node-uuid');
var cors = require('cors');
var path = require('path');

exports = module.exports = {};

exports.connectionHandler = function (id) {
    if (this._clients[id]) { throw new Error('Client with id ' + id + ' already exist!'); }
    this._clients[id] = {};
};

exports.disconnectHandler = function (id) {
    if (this._clients[id]) {
        delete this._clients[id];
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
        self.emit('connection', id);
        socket.on('close', function () {
            self.emit('disconnect', id);
        });
    });
};

exports._initializeHTTP = function () {
    this.use(require('body-parser')({ mapParams: false }));
    this.use(cors());
};
