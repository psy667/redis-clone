const assert = require("assert");
const {RESP} = require("../build/resp");
const { it, describe } = require("./test-framework");

describe('RESP', () => {
    it('decode RESP', () => {
        const expected = ['LLEN', 'mylist'];

        const p = new RESP((r) => assert.deepStrictEqual(r, expected));

        p.next('*2\r\n');
        p.next('$4\r\n');
        p.next('LLEN\r\n');
        p.next('$6\r\n');
        p.next('myli\r\n');
        p.next('st\r\n');
    })

    it('encode REPS', () => {
        const expected = '*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n'
        const actual = RESP.encode(['hello', 'world'])
        assert.deepStrictEqual(actual, expected)
    })

    it('decode RESP inline', () => {
        const expected = ['set', 'heya', 'defg', 'px', '100'];

        const p = new RESP((r) => assert.deepStrictEqual(r, expected));

        p.next('*5\r\n$3\r\nset\r\n$4\r\nheya\r\n$4\r\ndefg\r\n$2\r\npx\r\n$3\r\n100\r\n')
    });
});
