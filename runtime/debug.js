global["getCaller"] = () => {
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

exports.info = info => {
    if (info) {
        if (info instanceof Error) {
            console.error(info);
        }
        else if (info instanceof Object) {
            try {
                console.log(`[${getCaller()}] : ${JSON.stringify(info, null, 4)}`);
            } catch (error) {
                let text = JSON.stringify(info, ((key, value) => {
                    if (value instanceof Buffer || value instanceof Function) { 
                      return value.id;
                    } else {
                      return value;
                    };
                  }), 4);                  
                console.log(`[${getCaller()}] : ${JSON.stringify(text)}`);
            }
        }
        else {
            console.log(`[${getCaller()}] : ${info}`);
        }    
    }
}
