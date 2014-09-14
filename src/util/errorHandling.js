'use strict';
var logger = require('../util/logger').logger;


var apiErrorCodes = {    
    '999': { code: 'WE-999', httpCode: 500, description: 'Unexpected internal error occurred.' }

};
module.exports.apiErrorCodes = apiErrorCodes;

var errorCodes = {
    
    UNCAUGHT_EXCEPTION: { code: '001', description: 'Uncaught exception in server.'},

};
module.exports.errorCodes = errorCodes;

var sendErrorResponse = function(error, req, res, message) {
    var response = {error: {code: error.httpCode,
        message: error.description,
        // TODO: Complete request id
        requestId: req.requestContext !== undefined ? req.requestContext.req_id : '',
        errors: [{           
            reason: error.code,
            message: message === undefined ? '' : message          
        }]
    }
    };
    res.status(error.httpCode).send(response)

};
module.exports.sendErrorResponse = sendErrorResponse;

/* jshint -W098*/
module.exports.expressErrorHandler = function(err, req, res, next) {  
    logger.error('Unhandled exception caught: ' + String(err.stack), errorCodes.UNCAUGHT_EXCEPTION, req.requestContext);
    sendErrorResponse(apiErrorCodes['999'], req, res);
};
