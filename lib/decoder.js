function parseHeader(chunk) {
  if (chunk.length >= 12) {
    // 32Bit  (= 4 Bytes) Little Endian
    const sec = chunk.readUInt32LE(0);
    const usec = chunk.readUInt32LE(4);
    const length = chunk.readUInt32LE(8);

    const header = {
      sec,
      usec,
      length,
    };

    const rest = chunk.slice(12);
    return [header, rest];
  }
  return [null, chunk];
}

function parsePacket(chunk, length) {
  if (chunk.length >= length) {
    // Note: slice second param is not the end position but the length to slice
    const packet = chunk.slice(0, length);
    const rest = chunk.slice(length);

    return [packet, rest];
  }
  return [null, chunk];
}

function parseRecord(chunk) {
  const headerResult = parseHeader(chunk);

  const header = headerResult[0];
  const headerRest = headerResult[1];

  if (header === null) {
    return [null, headerRest];
  }

  const packetResult = parsePacket(headerRest, header.length);
  const packet = packetResult[0];
  const packetRest = packetResult[1];

  if (packet === null) {
    return [null, chunk];
  }
  const record = {
    header,
    packet,
  };

  return [record, packetRest];
}

function parseBuffer(chunk) {
  const records = [];
  let rest;

  let buffer = chunk.slice(0);

  let hasRecords = true;

  while (hasRecords) {
    const recordResult = parseRecord(buffer);
    const record = recordResult[0];
    rest = recordResult[1];

    if (record === null) {
      // no more records
      hasRecords = false;
    } else {
      records.push(record);
      buffer = rest.slice(0);
    }
  }

  return [records, rest];
}

module.exports = {
  parseBuffer,
  decode: parseBuffer,
  parseRecord,
  parseHeader,
  parsePacket,
};
