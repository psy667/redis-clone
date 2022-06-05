import { Value } from "./resp";

export class Core {
    private map = new Map();
    private expMap = new Map();

    constructor() { }

    public ping() {
        return 'PONG'
    }

    public echo(value: Value) {
        return value;
    }

    public set(key: Value, value: Value, exp: Value, time: Value): string {
        if (typeof key !== 'string') {
            return 'Key must be a string'
        }

        this.map.set(key, value);

        if (typeof exp === 'string' && exp?.toUpperCase() === 'PX') {
            if (typeof time !== 'string') {
                return 'PX parameter must be a string';
            }

            this.expMap.set(key, Date.now() + parseInt(time))
        }

        return 'OK';
    }

    public get(key: Value): Value {
        if (typeof key !== 'string') {
            return 'Key must be a string'
        }

        if (this.expMap.has(key) && Date.now() > this.expMap.get(key)) {
            this.expMap.delete(key);
            this.map.delete(key);
            return null;
        }

        return this.map.get(key) || null;
    }
}