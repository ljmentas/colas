'use strict';

var config = require('./config/config');
var logger = require('./util/logger').logger;
var errorHandling = require('./util/errorHandling');

process.on('uncaughtException', function(err) {
    try {
        logger.error('Uncaught exception occurred: ' + err.stack, errorHandling.errorCodes.UNCAUGHT_EXCEPTION);
    } catch (e) {
        console.log('Uncaught exception occurred: ' + err.stack);
    }
    process.exit(1);
});

var express = require('express');
var app = express();
var expressMiddleware = require('./util/expressMiddlewares');
var server = require('http').createServer(app);
// Configuration
module.exports.app = app;
var routes = require('./routes');
app.use(expressMiddleware.setRequestContext);
//app.use(express.bodyParser());
//app.use(app.router);    
app.use(expressMiddleware.resourceNotFoundHandler);
app.use(errorHandling.expressErrorHandler);

// Init server


// Start listening on port configured port
app.listen(config.EnvConfig.port, function() {
  logger.info('Server listening on port ' + config.EnvConfig.port + ' in ' +
      config.DEPLOYMENT_MODE + ' mode');
});


/*
 * Exports the express app for other modules to use
 * all route matches go the routes.js file
 */


