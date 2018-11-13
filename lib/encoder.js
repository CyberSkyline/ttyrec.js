function encode(sec, usec, chunk) {
  const headerBuffer = Buffer.allocUnsafe(12);
  // 32Bit  (= 4 Bytes) Little Endian
  headerBuffer.writeUInt32LE(sec, 0);
  headerBuffer.writeUInt32LE(usec, 4);
  headerBuffer.writeUInt32LE(chunk.length, 8);

  // Join the header and chunk in one buffer/packet
  const packetBuffer = Buffer.concat([headerBuffer, chunk]);

  return packetBuffer;
}

module.exports = {
  encode,
};
