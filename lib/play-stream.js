const util = require('util');
const _ = require('lodash');

const TtyParseStream = require('./parse-stream');

/**
 * @constructor
 * @name TtyPlayStream
 * @param {Hash} options
 */
const TtyPlayStream = function (options) {
  const self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = _.cloneDeep(options);
  }

  self.settings.handler = function (stream, record, speed, callback) {
    stream.push(record.packet);
    callback(null);
  };

  // Run parent constructor
  TtyParseStream.call(this, self.settings);
};

util.inherits(TtyPlayStream, TtyParseStream);

module.exports = TtyPlayStream;
