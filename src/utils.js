const createLog = (logFunc, msg) => (...args) => logFunc(msg, args);

const log = (msg = 'log') => createLog(console.log, msg);
const errLog = (msg = 'errlog') => createLog(console.error, msg);
const reThrow = (msg) => (err) => {
    console.error(msg, err);
    throw err;
};


export { log, errLog, reThrow };
