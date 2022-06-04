const net = require("net");
import { RESP } from "./resp";
import { Core } from "./core";

const port = 6379;
const host = '127.0.0.1';


const server = net.createServer(socket => {
    const core = new Core();

    const cb = (message) => {
        const [cmd, ...args] = message;

        const commandMapping = {
            'PING': core.ping,
            'ECHO': core.echo,
            'GET': core.get,
            'SET': core.set,
        };

        const commands = Object.keys(commandMapping);
        
        console.log({command: cmd.toUpperCase(), args})

        if(!commands.includes(cmd.toUpperCase())) {
            console.log('Unknown command');
            socket.write(RESP.encode(null));
            return;
        }
        const commandHandler = commandMapping[cmd.toUpperCase()].bind(core);

        const result = commandHandler(...args);
        socket.write(RESP.encode(result));
    };

    const resp = new RESP(cb);

    socket.on('connection', () => {
        console.log('New connection');
    });

    socket.on('data', stream => {
        const message = stream.toString('utf-8');
        console.log({ message });
        resp.next(message);
    })
});

server.listen(port, host);
console.log('Ready to accept connections');