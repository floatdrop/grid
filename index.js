'use strict';

var express = require('express');
var mixin = require('utils-merge');
var proto = require('./lib/grid');
var http = require('http');

function createGridServer(options, callback) {

    var app = express();

    mixin(app, proto);

    app.options = {
        host: '0.0.0.0',
        port: null,
        server: null,
        debug: false,
        ssl: {},
        path: '/'
    };

    mixin(app.options, options);

    app._clients = {};
    app._server = app.options.server;

    if (!app._server && app.options.port) {
        app._server = http.createServer(app);
        app._server.listen(app.options.port, app.options.host, callback);
    }

    if (!app._server) {
        throw new Error('Neither port or server is passed to constructor - can\'t start GridServer');
    }

    app._initializeHTTP();
    app._initializeWSS();
    app._initializeHandlers();

    return app;
}

exports = module.exports = createGridServer;
