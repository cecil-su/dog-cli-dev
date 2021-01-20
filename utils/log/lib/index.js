'use strict';

const log = require('npmlog')

log.level = process.env.DOG_CLI_LOG_LEVEL || 'info'
log.heading = 'dog'

module.exports = log;
