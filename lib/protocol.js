'use strict';

exports = module.exports = {};

exports.WELCOME = 0;

exports.welcome = function (id) {
    return JSON.stringify({
        type: exports.WELCOME,
        id: id
    });
};
