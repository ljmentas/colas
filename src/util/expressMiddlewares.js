'use strict';
var logger = require('./logger').logger;
var errorHandling = require('./errorHandling');

module.exports.setRequestContext = function(req, res, next) {

    var req_id;
    if (req.headers['requestid'] === undefined) {
        req_id = require('node-uuid').v4();
    } else {
        req_id = req.headers['requestid'];
    }
   
    // Get ip from caller
    var caller_ip;
    caller_ip = req.connection.remoteAddress;
    req.request_ip = caller_ip;

    var requestContext = {        
        request_ip: caller_ip,
        req_id: req_id
    };

    req.requestContext = requestContext;

    next();
};


module.exports.resourceNotFoundHandler = function(req, res/*, next*/) {
    logger.info('Received unhandled request ' + req.method + ' on ' + req.path +
        ' ' + JSON.stringify(req.query), req.requestContext);
    errorHandling.sendErrorResponse(errorHandling.apiErrorCodes['004'], req, res);
};
