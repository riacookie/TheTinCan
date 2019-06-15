exports.getCaller = () => {
    let c, e, o, f, r;
    [_, e, o] = [undefined, new Error(), Error.prepareStackTrace];
    Error.prepareStackTrace = (_, s) => s;
    f = a => a.stack.shift().getFileName();
    [c, r] = [f(e), _];
    for (let _ in e.stack) {
        r = f(e);
        if (r != c) break;
    }
    Error.prepareStackTrace = o;
    return r;
}

exports.debug = (...messages) => {
    process.stdout.write(`[${this.getCaller()}] : `);
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message instanceof Error) {
            console.error(message);
        }
        else if (!message || message instanceof Object) {
            console.log(message);
        }
        else {
            process.stdout.write(message);
        }
    }
    process.stdout.write('\n');
}
