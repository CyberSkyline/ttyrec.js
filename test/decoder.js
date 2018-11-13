describe('ttyrec decode', () => {
  it('should find one record in a chunk with one record', (done) => {
    const { decoder } = ttyrec;
    const { encoder } = ttyrec;

    const onerecord = encoder.encode(10, 20, Buffer.from('abc'));
    expect(decoder.decode(onerecord)[0].length).to.be(1);
    done();
  });

  it('should find no record in a chunk with an incomplete record', (done) => {
    const { decoder } = ttyrec;
    const { encoder } = ttyrec;

    const onerecord = encoder.encode(10, 20, Buffer.from('abc'));
    const incompleteRecord = onerecord.slice(0, -2);

    // 0 records found
    expect(decoder.decode(incompleteRecord)[0].length).to.be(0);
    // Rest equals the incompleteRecord
    expect(decoder.decode(incompleteRecord)[1]).to.eql(incompleteRecord);
    done();
  });

  it('should find two records in a chunk with two record', (done) => {
    const { decoder } = ttyrec;
    const { encoder } = ttyrec;

    const onerecord = encoder.encode(10, 20, Buffer.from('abc'));
    const tworecord = encoder.encode(10, 20, Buffer.from('abc'));
    const bothrecords = ttyrec.Buffer.concat([onerecord, tworecord]);

    expect(decoder.decode(bothrecords)[0].length).to.be(2);
    done();
  });

  it('should find one record in a incomplete chunk with two record', (done) => {
    const { decoder } = ttyrec;
    const { encoder } = ttyrec;

    const onerecord = encoder.encode(0, 20, Buffer.from('abc'));
    const tworecord = encoder.encode(10, 20, Buffer.from('abc'));

    const bothrecords = ttyrec.Buffer.concat([onerecord, tworecord]);
    const incompleteRecords = bothrecords.slice(0, -2);

    const records = decoder.decode(incompleteRecords)[0];
    const firstRecord = records[0];

    expect(records.length).to.be(1);
    expect(firstRecord.packet.toString()).to.be('abc');
    expect(firstRecord.header.sec).to.be(0);
    expect(firstRecord.header.usec).to.be(20);
    done();
  });

  it('should not blow up with too much recursion', (done) => {
    const { decoder } = ttyrec;
    const { encoder } = ttyrec;
    const chunks = [];

    const nr = 1000;
    for (let i = 0; i < nr; i++) {
      const record = encoder.encode(i, 20, Buffer.from('a'));
      chunks.push(record);
    }

    const bigChunk = ttyrec.Buffer.concat(chunks);
    const records = decoder.decode(bigChunk)[0];

    expect(records.length).to.be(nr);
    done();
  });
});
