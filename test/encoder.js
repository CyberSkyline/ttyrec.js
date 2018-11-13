describe('ttyrec encoder', () => {
  it('should have length of 13 for 1 char', (done) => {
    const { encoder } = ttyrec;
    const sec = 10;
    const usec = 10;
    const chunk = Buffer.allocUnsafe(1);
    chunk[0] = 'a';

    const record = encoder.encode(sec, usec, chunk);
    expect(record.length).to.be(13);
    done();
  });
});
