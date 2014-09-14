'use strict';

var logger = require('../util/logger').logger;
var config = require('../config/config');


exports.getHealth = function (req, res) {

    logger.info('Processing request ' + req.method + ' on ' +
        req.path + ' ' + JSON.stringify(req.query), req.requestContext);
    var items = [];
    var healthStatus = true;


    var response = {
        'data' : {
            'kind' : 'healthcheck',
            'isHealthy': healthStatus           
        }
    };

    res.json(response);
    res.send();
    logger.info('Health Finished.', req.requestContext);   
   

};
