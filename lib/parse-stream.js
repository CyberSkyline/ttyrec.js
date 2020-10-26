const util = require('util');
const async = require('async');

const { Transform } = require('stream');
const decoder = require('./decoder');

// Default is to push the complete record
function defaultHandler(stream, record, speed, callback) {
  stream.push(record);
  callback(null);
}

/**
 * @constructor
 * @name TtyParserStream
 * @param {Hash} options
 */
const TtyParserStream = function (options) {
  const self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    // Copy the options
    self.settings = _.cloneDeep(options);
  }

  if (options && options.handler) {
    self.handler = options.handler;
  } else {
    self.handler = defaultHandler;
    self.settings.objectMode = true;
  }

  // PlaceHolder for unparsed chunk parts
  self.prevChunk = null;

  self.prevRecord = null;

  self.speed = 1;

  // Run parent constructor
  Transform.call(this, self.settings);
};

util.inherits(TtyParserStream, Transform);

module.exports = TtyParserStream;

TtyParserStream.prototype._transform = function (chunk, encoding, callback) {
  const self = this;

  let combinedChunk;

  if (self.prevChunk === null) {
    combinedChunk = chunk.slice(0);
  } else {
    combinedChunk = Buffer.concat([self.prevChunk, chunk]);
  }

  const bufferResult = decoder.parseBuffer(combinedChunk);
  const records = bufferResult[0];

  self.prevChunk = bufferResult[1];

  const iterator = function (record, cb) {
    let prevTs;

    const ts = (record.header.sec * 1000) + (record.header.usec / 1000);

    if (self.prevRecord === null) {
      // For the first record,
      // by setting prevTs to the timestamp
      // the first deltaTs becomes 0
      prevTs = ts;
    } else {
      prevTs = (self.prevRecord.header.sec * 1000) + (self.prevRecord.header.usec / 1000);
    }

    let deltaTs;

    if (self.speed === 0) {
      deltaTs = 0;
    } else {
      deltaTs = (ts - prevTs) / self.speed;
    }

    self.prevRecord = record;

    if (self.speed === 0) {
      self.handler(self, record, self.speed, cb);
    } else {
      setTimeout(() => {
        self.handler(self, record, self.speed, cb);
      }, deltaTs);
    }
  };

  async.eachSeries(records, iterator, () => callback(null));
};

TtyParserStream.prototype._flush = function (callback) {
  callback(null);
};

TtyParserStream.prototype.setSpeed = function (speed) {
  const self = this;

  self.speed = speed;
};
