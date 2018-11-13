const { encoder } = ttyrec;

describe('ttyrec Play Stream', () => {
  it('should encode a stream for one packet', (done) => {
    const playStream = new ttyrec.PlayStream();

    const text = 'bla';
    playStream.on('data', (t) => {
      expect(t.toString()).to.be(text);
      playStream.end();
      done();
    });
    const encoded = encoder.encode(0, 0, Buffer.from(text));
    playStream.write(encoded);
  });

  it('should handle the correct delay for a stream with absolute timestamp packet ', (done) => {
    const playStream = new ttyrec.PlayStream();

    const text = 'bla';
    playStream.on('data', (t) => {
      expect(t.toString()).to.be(text);
      playStream.end();
      done();
    });
    const encoded = encoder.encode(1000, 0, Buffer.from(text));
    playStream.write(encoded);
  });

  it('should encode a stream for two packet', (done) => {
    const playStream = new ttyrec.PlayStream();

    const playedRecords = [];
    const text1 = 'beep';
    const text2 = 'boop';

    playStream.on('data', (t) => {
      playedRecords.push(t);

      if (playedRecords.length === 2) {
        expect(playedRecords[0].toString()).to.be(text1);
        expect(playedRecords[1].toString()).to.be(text2);
        playStream.end();
        done();
      }
    });

    const encoded1 = encoder.encode(0, 0, Buffer.from(text1));
    const tenMsec = 10 * 1000; // in usec
    const encoded2 = encoder.encode(0, tenMsec, Buffer.from(text2));

    playStream.write(encoded1);
    playStream.write(encoded2);
  });

  it('should pass Play stream options', (done) => {
    const options = { highWaterMark: 1 };
    const playStream = new ttyrec.PlayStream(options);

    const text = '0123456789';
    const encoded = encoder.encode(0, 0, Buffer.from(text));
    const canContinueWriting = playStream.write(encoded);
    expect(canContinueWriting).to.be(false);
    done();
  });

  it('should work with utf8', (done) => {
    const playStream = new ttyrec.PlayStream();

    const text = '0123456789𡥂';

    playStream.setEncoding('utf8');

    playStream.on('data', (t) => {
      expect(t).to.be(text);
      expect(t).to.be.a('string');
      done();
    });

    const encoded = encoder.encode(0, 0, Buffer.from(text));
    playStream.write(encoded);
  });

  it('should not wait with speed 0', (done) => {
    const playStream = new ttyrec.PlayStream();
    playStream.setSpeed(0);

    const text = '0123456789';

    let count = 0;
    playStream.on('data', (t) => {
      count++;
      if (count === 2) {
        done();
      }
    });

    const encoded1 = encoder.encode(0, 0, Buffer.from(text));
    const encoded2 = encoder.encode(1000, 0, Buffer.from(text));
    playStream.write(encoded1);
    playStream.write(encoded2);
  });
});
