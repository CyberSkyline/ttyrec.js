# Ttyrec.js

A native implementation for encoding and decoding ttyrec files for node.js v10+.

Forked from https://github.com/jedi4ever/ttyrec.js to include changes for modern node.js. Last tested working on node v14.

- See [Ttyrec format specification](http://en.wikipedia.org/wiki/Ttyrec#Technical_file_format_specification)
- See [Ttyrec++](https://github.com/ewaters/ttyrec-plusplus)

# Installation

[![NPM](https://nodei.co/npm/ttyrec.js.png?downloads=true&stars=true)](https://nodei.co/npm/ttyrec.js/)

`npm install ttyrec.js`

## Write recStream
```js
var fs = require('fs');
var pty = require('pty');

var ttyrec = require('ttyrec.js');
var ttyrecStream = new ttyrec.recStream();

var fileStream = fs.createWriteStream('ttyrecord');

var _pty = pty.spawn('/bin/bash');
process.stdin.pipe(_pty);

_pty.pipe(ttyrecStream);
ttyrecStream.pipe(fileStream);
```

## Read playStream
```js
var fs = require('fs');

var ttyrec = require('ttyrec.js');
var fileStream = fs.createReadStream('ttyrecord');

var ttyplayStream = new ttyrec.playStream();

// Play at half the speed
ttyplayStream.setSpeed(0.5);

fileStream.pipe(ttyplayStream);
ttyplayStream.pipe(process.stdout);
```

## parseStream
```js
var fs = require('fs');

var ttyrec = require('ttyrec.js');
var fileStream = fs.createReadStream('ttyrecord');

var ttyparseStream = new ttyrec.parseStream();

// No waiting = speed 0
ttyparseStream.setSpeed(0);

fileStream.pipe(ttyparseStream);
ttyparseStream.on('data', function(record) {
  console.log(record.header);
  console.log(record.packet);
});
```

## Encode
```js
var ttyrec = require('ttyrec.js');
var encoder = ttyrec.encoder;
var sec = 0;
var usec = 10;
var record = encoder.encode(sec, usec, new Buffer('abc');
```

## Decode (parseBuffer)
```js
var ttyrec = require('ttyrec.js');
var decoder = ttyrec.decoder;
var results = decoder.decode(arecord);

// This returns an array of
// [0] = records
// [1] = rest of chunk not parsed
var records = result[0];
var record = records[0];
var rest = result[1];

var header = record.header;
console.log(header.sec, header.usec, header.length)
var packet = record.packet; // Buffer
console.log(packet.toString());
```

# Limitations
- only handles buffer streams(non-encoded streams)

# Todo
- enhance the executables to mimic arguments from real ttyrec and ttyplay (almost, need peek + help)
- handle special resizing escape codes for ttyrec
- browserify this code (almost, only process.hrtime does not exist in browser)
- help page
