const net = require("net");
const RESP = require("./resp");
const Core = require("./core");

const server = net.createServer(socket => {
    const core = new Core();
    console.log(core);
    const cb = (message) => {
        const [cmd, ...args] = message;

        const commandMapping = {
            'PING': core.ping,
            'ECHO': core.echo,
            'GET': core.get,
            'SET': core.set,
        };
        
        const commandHandler = commandMapping[cmd.toUpperCase()].bind(core);

        const result = commandHandler(args);
        socket.write(RESP.encode(result));
    };

    const resp = new RESP(cb);

    socket.on('data', stream => {
        const message = stream.toString('utf-8');
        console.log({ message });
        resp.next(message);

    })
});

server.listen(6379, '127.0.0.1');