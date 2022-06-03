const CRLF = '\r\n';

class RESP {
    constructor(cb) {
        this.cb = cb;

        this.init();
    }

    init() {
        this.result = undefined;
        this.arrLen = 0;
        this.isArr = false;
        this.isBulkStr = false;
        this.bulkStrLen = 0;
        this.currBulkStr = '';
    }

    next(input) {
        let i = 0;
        let r;

        if(this.isBulkStr) {
            while (this.bulkStrLen && !input.slice(i).startsWith(CRLF)) {
                this.currBulkStr += input[i]
                i++;
                this.bulkStrLen--;
            }
            if(this.bulkStrLen) {
                return;
            } else {
                r = this.currBulkStr;

                this.isBulkStr = false;
                this.bulkStrLen = 0;
                this.currBulkStr = '';

            }
        }


        switch (input[0]) {
            case '+': { // string
                r = '';
                i++;
                while (!input.slice(i).startsWith(CRLF)) {
                    r += input[i]
                    i++;
                }
                break;
            }
            case '-': { // error
                str = '';
                i++;
                while (!input.slice(i).startsWith(CRLF)) {
                    str += input[i]
                    i++;
                }
                r = new Error(str);
                break;
            }
            case ':': { // integer
                let n = '';
                i++;
                while (!input.slice(i).startsWith(CRLF)) {
                    n += input[i]
                    i++;
                }
                r = parseInt(n);
                break;
            }
            case '$': { // bulk string
                let len = '';
                i++;
                while (!input.slice(i).startsWith(CRLF)) {
                    len += input[i]
                    i++;
                }
                this.isBulkStr = true;
                this.bulkStrLen = parseInt(len);
                break;
            }
            case '*': { // array
                let len = '';
                i++;
                while (!input.slice(i).startsWith(CRLF)) {
                    // i // ?
                    len += input[i]
                    i++;
                }
                this.isArr = true;
                this.arrLen = parseInt(len);
                this.result = [];
                break;
            }
            default: { // ???
                break;
            }

        }

        if (r != undefined) {
            if (this.isArr) {
                if (this.arrLen > 1) {
                    this.result.push(r);
                    this.arrLen--;
                } else {
                    this.isArr = false;
                    this.result.push(r);
                    this.stop();
                }
            } else {
                this.result = r;
                this.stop();
            }
        }
        if(input.length > i + CRLF.length) {
            this.next(input.slice(i + CRLF.length))
        }
    }

    stop() {
        this.cb(this.result);
        this.init();
    }


    static encode(value) {
        if(typeof value === 'string') {
            return '$' + value.length + CRLF + value + CRLF;
        }
        if(typeof value === 'number') {
            return ':' + value + CRLF;
        }
        if(typeof value === 'object' && Array.isArray(value)) {
            return '*' + value.length + CRLF + value.map(this.encode).join('')
        }
    }
}

module.exports = RESP;



