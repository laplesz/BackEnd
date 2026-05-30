const EventEmitter = require('events');

class StatsEmitter extends EventEmitter {}

module.exports = new StatsEmitter();
