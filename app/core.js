module.exports = class Core {
    constructor() {
        this.map = new Map();
        this.expMap = new Map();
    }

    ping() {
        return 'PONG'
    }

    echo(args) {
        return args[0]
    }

    set(args) {
        const [key, value, exp, ms] = args;

        this.map.set(key, value);

        if (exp?.toUpperCase() === 'PX') {
            this.expMap.set(key, Date.now() + parseInt(ms))
        }

        return 'OK';
    }

    get(args) {
        const [key] = args;

        if (this.expMap.has(key) && Date.now() > this.expMap.get(key)) {
            this.expMap.delete(key);
            this.map.delete(key);
        }

        return this.map.get(key) || null;
    }
}