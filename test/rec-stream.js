const { decoder } = ttyrec;

describe('ttyrec Rec Stream', () => {
  it('should encode a stream for one packet', (done) => {
    const recStream = new ttyrec.RecStream();

    const text = 'bla';
    recStream.on('data', (record) => {
      const results = decoder.decode(record);
      const records = results[0];
      const r = records[0];
      expect(r.packet).to.eql(Buffer.from(text));
      expect(r.header.sec).to.be(0);
      expect(r.header.usec).to.be(0);
      expect(r.header.length).to.be(3);
      recStream.end();

      done();
    });
    recStream.write(text);
  });

  it('should encode a stream for two packet', (done) => {
    const recStream = new ttyrec.RecStream();

    const text1 = 'beep';
    const text2 = 'boop';
    const trecords = [];

    recStream.on('data', (record) => {
      const results = decoder.decode(record);
      const records = results[0];
      const r = records[0];
      trecords.push(r);

      if (trecords.length === 2) {
        expect(trecords[0].packet).to.eql(Buffer.from(text1));
        expect(trecords[1].packet).to.eql(Buffer.from(text2));
        recStream.end();
        done();
      }
    });

    recStream.write(text1);
    setTimeout(() => {
      recStream.write(text2);
    }, 10);
  });

  it('should pass stream options', (done) => {
    const options = { highWaterMark: 1 };
    const recStream = new ttyrec.RecStream(options);
    recStream.on('data', (record) => {
      done();
    });

    const largeChunk = Buffer.from('0123456789abcdefghijklmnopqrstuvwxyz');
    recStream.write(largeChunk);
  });

  it('should pass Rec stream options', (done) => {
    const options = { highWaterMark: 1 };
    const recStream = new ttyrec.RecStream(options);

    const largeChunk = Buffer.from('0123456789abcdefghijklmnopqrstuvwxyz');
    const canContinueWriting = recStream.write(largeChunk);
    expect(canContinueWriting).to.be(false);
    done();
  });

  it('should work with utf8', (done) => {
    const text = '0123456789𡥂';

    const recStream = new ttyrec.RecStream();
    recStream.setEncoding('utf8');

    recStream.on('data', (utfRecord) => {
      const record = Buffer.from(utfRecord);
      const results = decoder.decode(record);
      const records = results[0];
      const r = records[0];
      expect(r.packet).to.eql(Buffer.from(text));
      done();
    });

    recStream.write(text);
  });
});
