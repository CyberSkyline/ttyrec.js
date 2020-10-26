const _ = require('lodash');
const util = require('util');

const { Transform } = require('stream');

function defaultHandler(stream, record, callback) {
  stream.push(record);
  callback(null);
}

const { hrtime } = process;

/**
 * @constructor
 * @name TtyGeneratorStream
 * @param {Hash} options
 */
function TtyGeneratorStream(options) {
  const self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = _.cloneDeep(options);
  }

  self.time = null;

  if (options && options.handler) {
    self.handler = options.handler;
  } else {
    self.handler = defaultHandler;
    self.settings.objectMode = true;
  }

  // Run parent constructor
  Transform.call(this, self.settings);
}

util.inherits(TtyGeneratorStream, Transform);

module.exports = TtyGeneratorStream;

TtyGeneratorStream.prototype._transform = function (chunk, encoding, callback) {
  const self = this;

  let sec; let
    usec;
  let bufferChunk;

  if (encoding === 'buffer') {
    bufferChunk = chunk;
  }

  if (encoding === 'utf8') {
    bufferChunk = Buffer.from(chunk, 'utf8');
  }

  if (self.time === null) {
    // This is the first we are writing
    self.time = hrtime();
    sec = 0;
    usec = 0;
  } else {
    // This is next time
    const diff = hrtime(self.time);
    sec = diff[0];
    usec = Math.round(diff[1] / 1e3);
  }

  const record = {
    header: {
      sec,
      usec,
    },
    packet: bufferChunk,
  };

  self.handler(self, record, callback);
};
