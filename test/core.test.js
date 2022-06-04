const assert = require("assert");

const Core = require("../app/core");
const { it, describe } = require("./test-framework");

const core = new Core();

describe('Core', () => {
    it('save value', () => {
        core.set(['foo', 'bar']);
        const expected = 'bar';
        const actual = core.get(['foo']);
    
        assert.deepStrictEqual(actual, expected);
    })
    
    it('delete value after expiration', () => {
        core.set(['foo', 'bar', 'px', 100]);
    
        setTimeout(() => {
            const actual = core.get(['foo']);
    
            assert.deepStrictEqual(actual, 'bar');
        }, 50);
    
        setTimeout(() => {
            const actual = core.get(['foo']);
    
            assert.deepStrictEqual(actual, null);
        }, 150);
    });
})

