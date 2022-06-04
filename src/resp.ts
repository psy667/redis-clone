const CRLF = '\r\n';

type Value = string | number | null | Error

export class RESP {
    private result: Value[]
    private arrLength: number;
    private isArray: Boolean;
    private isBulkStr: Boolean
    private bulkStrLength: number;
    private currBulkStr: string;
    
    constructor(
        private cb: (value: Value[]) => void
    ) {
        this.init();
    }

    init() {
        this.result = undefined;
        this.arrLength = 0;
        this.isArray = false;
        this.isBulkStr = false;
        this.bulkStrLength = 0;
        this.currBulkStr = '';
    }

    private decodeString(input, i): [string, number] {
        let r = ''

        i++;
        while (!input.slice(i).startsWith(CRLF)) {
            r += input[i]
            i++;
        }
        return [r, i]
    }

    private decodeError(input, i): [Error, number] {
        let message = '';
        i++;
        while (!input.slice(i).startsWith(CRLF)) {
            message += input[i]
            i++;
        }
        return [new Error(message), i]
    }

    private decodeNumber(input, i): [number, number] {
        let n = '';
        i++;
        while (!input.slice(i).startsWith(CRLF)) {
            n += input[i]
            i++;
        }
        return [parseInt(n), i]
    }

    next(input) {
        let i = 0;
        let r: Value;

        if(this.isBulkStr) {
            while (this.bulkStrLength && !input.slice(i).startsWith(CRLF)) {
                this.currBulkStr += input[i]
                i++;
                this.bulkStrLength--;
            }
            if(this.bulkStrLength) {
                return;
            } else {
                r = this.currBulkStr;

                this.isBulkStr = false;
                this.bulkStrLength = 0;
                this.currBulkStr = '';

            }
        }

        switch (input[0]) {
            case '+': { // string
                [r, i] = this.decodeString(input, i);
                break;
            }
            case '-': { // error
                [r, i] = this.decodeError(input, i);
                break;
            }
            case ':': { // integer
                [r, i] = this.decodeNumber(input, i);
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
                this.bulkStrLength = parseInt(len);
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
                this.isArray = true;
                this.arrLength = parseInt(len);
                this.result = [];
                break;
            }
            default: { // ???
                break;
            }

        }

        if (r != undefined) {
            if (this.isArray) {
                if (this.arrLength > 1) {
                    this.result.push(r);
                    this.arrLength--;
                } else {
                    this.isArray = false;
                    this.result.push(r);
                    this.stop();
                }
            } else {
                this.result = [r];
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
        if(value === null) {
            return '$-1\r\n'
        }
    }
}