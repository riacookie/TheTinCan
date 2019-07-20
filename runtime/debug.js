module.exports.getCaller = () => {
    let c, e, o, f, r, result;
    [_, e, o] = [undefined, new Error(), Error.prepareStackTrace];
    Error.prepareStackTrace = (_, s) => s;
    f = a => a.stack.shift();
    [c, r] = [f(e).getFileName(), _];
    for (let i = 0; i < e.stack.length; i++) {
        r = f(e);
        if (r.getFileName() != c) break;
    }
    Error.prepareStackTrace = o;
    return r.getFileName() + ':' + r.getLineNumber();
}

module.exports.write = str => {
    if (!process.env.no_colors) process.stdout.write(str);
}

module.exports.debug = (...messages) => {
    this.write('\x1b[1m\x1b[36m');
    process.stdout.write(`[${this.getCaller()}] : `);
    this.write('\x1b[22m\x1b[0m');
    let flag = false;
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message instanceof Error) {
            this.write('\x1b[31m');
            console.error(message);
            this.write('\x1b[0m');
            flag = true;
        }
        else if (typeof message != 'string') {
            console.log(message);
            flag = true;
        }
        else {
            this.write("\x1b[1m\x1b[32m'");
            process.stdout.write(message);
            this.write("'\x1b[22m\x1b[0m ");
            flag = false;
        } 
    }
    if (!flag) process.stdout.write('\n');
}
