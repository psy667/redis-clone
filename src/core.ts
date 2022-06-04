export class Core {
    private map = new Map();
    private expMap = new Map();
    
    constructor() {}

    public ping() {
        return 'PONG'
    }

    public echo(value: string) {
        return value;
    }

    public set(key: string, value: string, exp: string, ms: string) {
        this.map.set(key, value);

        if (exp?.toUpperCase() === 'PX') {
            this.expMap.set(key, Date.now() + parseInt(ms))
        }

        return 'OK';
    }

    public get(key: string) {
        if (this.expMap.has(key) && Date.now() > this.expMap.get(key)) {
            this.expMap.delete(key);
            this.map.delete(key);
            return null;
        }

        return this.map.get(key) || null;
    } 
}