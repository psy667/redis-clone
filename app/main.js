const net = require("net");
const RESP = require("./resp");

const server = net.createServer(socket => {
    const map = new Map();
    const expMap = new Map();

    const cb = (result) => {
        const [cmd, ...args] = result;
        
        console.log({cmd, args});

        switch(cmd.toUpperCase()) {
            case 'PING': {
                socket.write(RESP.encode('PONG'));
                break;
            }
            case 'ECHO': {
                socket.write(RESP.encode(args[0]));
                break;
            }
            case 'SET': {
                const [key, value, exp, ms] = args;
                map.set(key, value);

                if(exp.toUpperCase() === 'PX') {
                    expMap.set(key, Date.now() + ms)
                }

                socket.write(RESP.encode('OK'));
                break;
            }
            case 'GET': {
                const [key] = args;

                if(Date.now() > expMap.get(key)) {
                    expMap.delete(key);
                    map.delete(key);
                }

                socket.write(RESP.encode(map.get(key)));
                break;
            }
        }
    };

    const resp = new RESP(cb);

    socket.on('data', stream => {
        const message = stream.toString('utf-8');
        console.log({message});
        resp.next(message);
        
    })
});

server.listen(6379, '127.0.0.1');