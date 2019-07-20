global['boot_time'] = new Date().getTime();
(async () => {
    global['debug'] = require('./runtime/debug').debug;
    debug(`initialized /rutime/debug.js.`);
    if (!process.env.live) {
        debug(`project isn't live, parsing environment variables with dotenv...`);
        require('dotenv').config();
        debug(`parsed environment variables.`);
    }
    await require('./runtime/globals')();
    debug(`initialized /runtime/globals.js.`);
    require('./runtime/webserver')();
    debug(`initialized /runtime/webserver.js.`);
    await require('./runtime/bot.js')();
    debug(`initialized /runtime/bot.js.`);
})();
