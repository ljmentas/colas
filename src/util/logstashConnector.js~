'use strict';

var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var config = require('../config/config');


var LogstashLogger = function(options) {
    this.options = options || {};   
    this.port = this.options.port || config.EnvConfig.logstashPort;
    this.host = this.options.host || config.EnvConfig.logstashAgent;
    this.bufferSize = this.options.bufferSize || config.EnvConfig.logstashAgent;

    this.disableLogstash = config.EnvConfig.disableLogstash;
    this.connected = false;
    this.queues = [];
    this.retryTimer = null;
    this.head = 0;
    this.tail = 0;
    if(!config.EnvConfig.disableLogstash){
        this.stream = net.createConnection(this.port, this.host);

        this.stream.on('connect', function() {
            this.onConnect();
        }.bind(this));

        this.stream.on('error', function(error) {
            this.onError(error);
            this.stream.destroy();
        }.bind(this));

        this.stream.on('close', function() {
            this.onClose();
        }.bind(this));

        this.stream.on('disconnect', function() {
            util.log('Logstash disconnected ');
        }.bind(this));

        EventEmitter.call(this);
    }
};

util.inherits(LogstashLogger, EventEmitter);

LogstashLogger.prototype.onConnect = function() {
    util.log('[EM][logstashConnector - onConnect] Logstash connected to ' + this.host + ':' + this.port);

    this.connected = true;

    if (this.queues.length > 0) {
        this.flushQueue();
    }

    this.emit('connect');
};

LogstashLogger.prototype.onError = function(error) {

    var message = 'ERROR Logstash connection to ' + this.host + ':' + this.port + ' failed: ' + error.message;
    util.log(message);

    this.connected = false;
    this.retry();
};

LogstashLogger.prototype.onClose = function() {

    var message = 'connection to ' + this.host + ':' + this.port + ' CLOSED';
    util.log(message);

    this.connected = false;
    this.emit('close');
    this.retry();
};

LogstashLogger.prototype.retry = function() {
    if (this.retryTimer) {
        return;
    }

    this.retryTimer = setTimeout(function() {
        util.log('Retrying connection...');

        this.emit('retry');
        this.stream.connect(this.port, this.host);
        this.retryTimer = null;
    }.bind(this), 3000); //TODO: check if this value should be obtained from config
};

LogstashLogger.prototype.post = function(data) {

    var buffer = new Buffer(data);

    this.sendQueue(buffer);
};

LogstashLogger.prototype.sendQueue = function(buffer) {
    if ((!this.disableLogstash) && this.connected) {
        try {
            this.stream.write(buffer, function(err) {
                if (err) {
                    this.pushQueue(buffer);
                }
            }.bind(this));
        } catch (e) {
            this.pushQueue(buffer);
        }
    } else {
        this.pushQueue(buffer);
    }
};

LogstashLogger.prototype.pushQueue = function(buffer) {
    if (!this.disableLogstash) {
        this.queues[this.tail] = buffer;
        this.tail++;

        if (this.tail >= this.bufferSize) {
            this.tail = 0;
        }

        if (this.head === this.tail) {
            this.head++;

            if (this.head >= this.bufferSize) {
                this.head = 0;
            }
        }
    }
};

LogstashLogger.prototype.flushQueue = function() {
    var i;

    if (this.head > this.tail) {
        for (i = this.head; i < this.queues.length; i++) {
            this.sendQueue(this.queues[i]);
        }

        for (i = 0; i < this.tail; i++) {
            this.sendQueue(this.queues[i]);
        }
    } else {
        for (i = this.head; i < this.tail; i++) {
            this.sendQueue(this.queues[i]);
        }
    }

    this.queues = [];
    this.head = 0;
    this.tail = 0;
};

LogstashLogger.prototype.isLogstashConnected = function() {
    return this.connected;
};

exports.createLogger = function(options) {
    return new LogstashLogger(options);
};
