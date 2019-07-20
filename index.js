global['boot_time'] = new Date().getTime();
(async () => {
    if (!process.env.prefix) require('dotenv').config();
    global['debug'] = require('./runtime/debug').debug;
    debug(`initialized /rutime/debug.js.`);
    await require('./runtime/globals')();
    debug(`initialized /runtime/globals.js.`);
    require('./runtime/webserver')();
    debug(`initialized /runtime/webserver.js.`);
    await require('./runtime/bot.js')();
    debug(`initialized /runtime/bot.js.`);
})();
