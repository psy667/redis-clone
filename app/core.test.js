const assert = require("assert");

const Core = require("./core");

const core = new Core();

{
    core.set(['foo', 'bar']);
    const expected = 'bar';
    const actual = core.get(['foo']);

    assert.deepStrictEqual(actual, expected);
}

{
    core.set(['foo', 'bar', 'px', 100]);

    setTimeout(() => {
        const actual = core.get(['foo']);

        assert.deepStrictEqual(actual, 'bar');
    }, 50);

    setTimeout(() => {
        const actual = core.get(['foo']);

        assert.deepStrictEqual(actual, null);
    }, 150);
}