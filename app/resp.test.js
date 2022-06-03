const assert = require("assert");
const RESP = require("./resp");

{
    const expected = ['LLEN', 'mylist'];

    const p = new RESP((r) => assert.deepStrictEqual(r, expected, 'should decode RESP sequence'));

    p.next('*2\r\n');
    p.next('$4\r\n');
    p.next('LLEN\r\n');
    p.next('$6\r\n');
    p.next('myli\r\n');
    p.next('st\r\n');
}

{
    const expected = '*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n'
    const actual = RESP.encode(['hello', 'world'])
    assert.deepStrictEqual(actual, expected, 'should encode values into RESP')
}

{
    const expected = ['set', 'heya', 'defg', 'px', '100'];

    const p = new RESP((r) => assert.deepStrictEqual(r, expected, 'should decode RESP inline'));

    // p.next('*1\r\n$4\r\nping\r\n') 
    p.next('*5\r\n$3\r\nset\r\n$4\r\nheya\r\n$4\r\ndefg\r\n$2\r\npx\r\n$3\r\n100\r\n')
}

