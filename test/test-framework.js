const { exit } = require('process');
const { clearTimeout } = require('timers');

const text = {
    Reset: "\x1b[0m",
    FgGreen: "\x1b[32m",
    FgRed: "\x1b[31m",
    Bold: "\u001b[1m",
}


let suits = [];
let afterAllCb;
let beforeAllCb;

let c = 0;
const sleep = (t) => new Promise(r => setTimeout(r, t));
const tick = (n) => new Promise(r => setImmediate(r));

let intervalLoaderId;

const startLoader = (text) => {
    let current = 1;
    let animation = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]
    intervalLoaderId = setInterval(() => {
        current++;
        process.stdout.write(`\r${animation[current % animation.length]} ${text}`)
    }, 100);

    return new Promise((r) => { }, r => {
        console.log({ r })
    })
}

const stopLoader = () => {
    clearInterval(intervalLoaderId);
}

const testQueue = [];

let testRun;

const describe = async (title, describeFn) => {
    testQueue.push({title, describeFn});

    clearTimeout(testRun)
    testRun = setTimeout(() => {
        testRunner();

    }, 100)
}

const testRunner = async () => {
    for await (const {title, describeFn} of testQueue) {
        suits = [];
        afterAllCb = undefined;
        beforeAllCb = undefined;

        if (c !== 0) {
            console.log('')
        }
        console.log(`${text.Bold}${title}${text.Reset}`)
    
        describeFn()
    
        if (beforeAllCb) await beforeAllCb()
    
        for await (const { title, fn } of suits) {
            try {
                startLoader(title);
                await sleep(500);
    
                await fn();
                stopLoader();
    
                console.log(`\r${text.FgGreen}+ ${title} passed ${text.Reset}`)
            } catch (err) {
                console.log(`${text.FgRed}${title} not passed ${text.Reset}`)
                console.log(err);
    
                if (afterAllCb) afterAllCb();
                exit(1);
            }
        }
        c += suits
        console.log(`${suits.length} test passed`)
        if (afterAllCb) await afterAllCb();
    
    }
}

const beforeAll = async (beforeAllFn) => {
    beforeAllCb = beforeAllFn;
}

const afterAll = (fn) => {
    afterAllCb = fn;
}

const it = (title, fn) => {
    suits.push({ title, fn })
};

module.exports = { beforeAll, afterAll, it, describe }