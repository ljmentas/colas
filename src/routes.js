'use strict';

/* This file maps your route matches
 * to functions defined in various
 * controller classes
 */
var app = module.parent.exports.app;

/* require your controllers here */
var corsController = require('./controllers/cors');
var healthController = require('./controllers/health');
var logger = require('./util/logger').logger;



app.all('/*', function(req, res, next) {
    corsController.addHeaders(req, res, next);
});


console.log("aca toy");
app.get('/health', function(req, res) {
    console.log("aca toy");
    healthController.getHealth(req, res);

/*app.delete('/enclaves/:id', function(req, res) {
    enclaveController.terminateEnclave(req, res);*/
});


