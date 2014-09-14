'use strict';

var DEPLOYMENT_MODE = 'DEBUG';

var levels = {
    DEBUG : 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3
};
exports.logLevels = levels;

var EnvConfig = {
    //Port where REST node.js server listen for requests
    port: 8080,
    //Express framework error behavior
    expressErrorHandler: { dumpExceptions: true, showStack: true },    
    //Port where logstash agent is listening for log events
    logstashPort: 28777,
    //Address where logstash agent is listening for requests
    logstashAgent: '127.0.0.1',
    //Number of messages that can be queued if logstash agent is down
    logstashBufferSize: 10000,
    //Define if messages are sent to logstash agent. If True, messages are not sent to logstash
    disableLogstash: true,
    //Define if log is sent to console
    outputLogToConsole: true,
    //Define application log level
    logLevel: levels.DEBUG,

};

module.exports.EnvConfig = EnvConfig;
module.exports.DEPLOYMENT_MODE = DEPLOYMENT_MODE;

