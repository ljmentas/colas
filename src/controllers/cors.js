'use strict';

var logger = require('../util/logger').logger;

exports.addHeaders = function (req, res, next) {

    if (req.headers.origin) {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    if (req.method === 'OPTIONS') {
        // TODO: Check what is really needed to be returned here
        logger.debug('[EM][CorsController - Processing request] Received OPTIONS request for ' + req.path, req.requestContext);
        res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Content-Type');
        res.header('Access-Control-Allow-Methods', 'DELETE, POST');
        res.send(200);
    } else {
        next();
    }
};
