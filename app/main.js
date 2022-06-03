const net = require("net");
const RESP = require("./resp");

console.log("Logs from your program will appear here!");

const server = net.createServer(socket => {

    const cb = (result) => {
        const [cmd, ...args] = result;
        
        console.log({cmd, args});

        if(cmd === 'PING') {
            socket.write(RESP.encode('PONG'))
        }

        if(cmd === 'ECHO') {
            socket.write(RESP.encode(args[0]))
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


/*
*2
$4
LLEN
$6\r\n
mylist\r\n
*/



