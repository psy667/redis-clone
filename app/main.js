const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

class RESP {
    static fromStr(str) {
        return `+${str.trim()}\r\n`
    }
}

const server = net.createServer(socket => {
    socket.on('data', stream => {
        const request = stream.toString('utf-8');

        switch(request) {
            case '+PING\r\n':
                socket.write(Buffer.from(RESP.fromStr('PONG')));
                break;
            default:
                socket.write(Buffer.from('Unknown command'));
        }
    })
});

server.listen(6379, '127.0.0.1');
