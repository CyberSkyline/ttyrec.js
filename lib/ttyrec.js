const playStream = require('./play-stream');
const recStream = require('./rec-stream');

const parseStream = require('./parse-stream');
const generatorStream = require('./generator-stream');
const encoder = require('./encoder.js');
const decoder = require('./decoder.js');

module.exports = {
  PlayStream: playStream,
  RecStream: recStream,
  ParseStream: parseStream,
  GeneratorStream: generatorStream,
  encoder,
  decoder,
  Buffer,
  process,
};
