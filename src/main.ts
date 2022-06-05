import net from "net";
import { RESP, Value } from "./resp";
import { Core } from "./core";

const port = 6379;
const host = '127.0.0.1';


const server = net.createServer(socket => {
    const core = new Core();

    const cb = (message: Value[]) => {
        const [cmd, ...args] = message;

        if (typeof cmd !== 'string') {
            return;
        }

        const commandMapping: Record<string, (...args: Value[]) => Value> = {
            'PING': core.ping,
            'ECHO': core.echo,
            'GET': core.get,
            'SET': core.set,
        };

        const command = cmd.toUpperCase();

        if (commandMapping.hasOwnProperty(cmd)) {
            const commandHandler = commandMapping[command].bind(core);
            const result = commandHandler(...args);
            socket.write(RESP.encode(result));

        } else {
            console.log('Unknown command');
            socket.write(RESP.encode(null));
            return;
        };
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