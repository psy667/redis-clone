const assert = require("assert");
const RESP = require("./resp");

{
    const expected = [ 'LLEN', 'mylist' ];

    const p = new RESP((r) => assert.deepStrictEqual(expected, r, 'should decode RESP sequence'));

    p.next('*2\r\n');
    p.next('$4\r\n');
    p.next('LLEN\r\n');
    p.next('$6\r\n');
    p.next('myli\r\n');
    p.next('st\r\n');
}

{
    const expected = '*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n'
    const actual = RESP.encode([ 'hello', 'world' ]) 
    assert.deepStrictEqual(expected, actual, 'should encode values into RESP')
}