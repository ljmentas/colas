'use strict';
var logClient = require('../util/logstashConnector');
var loggerClient = logClient.createLogger();
var config = require('../config/config');

var logsTable = {};
var levels = config.logLevels;

function createLogLine(msg, baseTags, addedTags, level, requestContext) {

    var logLine = {};
    var fields = {};

    logLine['@message'] = msg;
    logLine['@timestamp'] = new Date();
 
    if (level !== undefined && level !== '') {
        fields.loglevel = level;
    }

    if (requestContext !== undefined) {
        if (requestContext.req_id !== undefined) {
            fields.requestid = requestContext.req_id;
        } else {
            fields.requestid = 'n/a';
        }

        if (requestContext.request_ip !== undefined) {
            fields.ip = requestContext.request_ip;
        } else {
            fields.ip = 'n/a';
        }
       
    } else {
        fields.requestid = 'unknown';
        fields.ip = 'unknown';
        fields.apikey = 'unknown';
        fields.userid = 'unknown';
    }

   
    logLine['@fields'] = fields;

    if (addedTags !== undefined) {
        logLine['@tags'] = baseTags.concat(addedTags);
    } else {
        logLine['@tags'] = baseTags;
    }

    return logLine;
}

function writeLogLine(logLine) {

    var formattedLine = JSON.stringify(logLine) + '\n';
    loggerClient.post(formattedLine);

    if (config.EnvConfig.outputLogToConsole === true) {
        console.log(logLine['@message']);        
    }
}

var info = function(msg, requestContext, tags) {
    if(config.EnvConfig.logLevel <= levels.INFO) {
        var logLine = createLogLine(msg, this.tags, tags, 'info', requestContext);
        writeLogLine(logLine);
    }
};

var debug = function(msg, requestContext, tags) {
    if(config.EnvConfig.logLevel <= levels.DEBUG) {
        var logLine = createLogLine(msg, this.tags, tags, 'debug', requestContext);
        writeLogLine(logLine);
    }
};

var error = function(msg, errorCode, requestContext, tags) {
    if(config.EnvConfig.logLevel <= levels.ERROR) {
        var logLine = createLogLine('['+ errorCode.code + ']' + msg, this.tags, tags, 'error', requestContext);
        writeLogLine(logLine);
    }
};

var warning = function(msg, requestContext, tags) {
    if(config.EnvConfig.logLevel <= levels.WARNING) {
        var logLine = createLogLine(msg, this.tags, tags, 'warning', requestContext);
        writeLogLine(logLine);
    }
};


var isLogstashConnected = function() {
    return loggerClient.isLogstashConnected();
};

function Logger(tag) {
    this.tags = [];

    if (tag !== undefined) {
        this.tags.push(tag);
    }

    this.addTag = function(tag) {
        if (tag !== undefined) {
            this.tags.push(tag);
        }
    };

}

Logger.prototype.info = info;
Logger.prototype.error = error;
Logger.prototype.warning = warning;
Logger.prototype.debug = debug;
Logger.prototype.isLogstashConnected = isLogstashConnected;

function getLogger(tag) {
    if (logsTable[tag] === undefined) {
        var newLoggerInstance = new Logger(tag);
        logsTable[tag] = newLoggerInstance;
        return newLoggerInstance;
    }else {
        return logsTable[tag];
    }
}

exports.logger = getLogger('colas');
exports.getLogger = getLogger;

