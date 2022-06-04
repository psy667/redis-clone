const assert = require('assert');
const { createClient } = require('redis');
const { beforeAll, afterAll, it, describe } = require('./test-framework');

require('./core.test')
require('./resp.test')

describe('Redis', () => {
    let client;

    beforeAll(async () => {
        client = createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        return client;
    })
    
    afterAll(() => {
        client.disconnect();
    })
    
    it('test ping', async () => {
        const pingResponse = await client.ping();
        assert.deepStrictEqual(pingResponse, 'PONG');
    })
    
    it('test echo', async () => {
        const echoResponse = await client.echo('hello');
        assert.deepStrictEqual(echoResponse, 'hello');
    })
    
    it('test SET and GET', async () => {
        const [key, value] = ['foo', 'bar'];
    
        await client.set(key, value);
    
        const response = await client.get(key);
    
        assert.deepStrictEqual(response, value);
    })
    
    it('test expiration', async () => {
        const [key, value] = ['foo', 'bar'];
        
        await client.set(key, value, {PX: 100});
    
        const response = await new Promise(r => setTimeout(async () => {
            client.get(key).then(r)
        }, 110));
    
        assert.deepStrictEqual(response, null);
    })
})
