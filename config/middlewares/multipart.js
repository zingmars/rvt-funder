'use strict';

/* File handler */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: 'tmp'});

module.exports = multipartMiddleware;