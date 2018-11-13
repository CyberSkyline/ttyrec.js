const util = require('util');

const encoder = require('./encoder');
const TtyGeneratorStream = require('./generator-stream');

/**
 * @constructor
 * @name TtyRecStream
 * @param {Hash} options
 */
const TtyRecStream = function (options) {
  const self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.handler = function (stream, record, callback) {
    const { header } = record;

    const packetBuffer = encoder.encode(header.sec, header.usec, record.packet);
    stream.push(packetBuffer);
    callback(null);
  };

  // Run parent constructor
  TtyGeneratorStream.call(this, self.settings);
};

util.inherits(TtyRecStream, TtyGeneratorStream);

module.exports = TtyRecStream;
