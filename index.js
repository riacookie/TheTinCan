(async () => {
    global['debug'] = require('./runtime/debug').info;
    debug('booting globals.js...');
    await require('./runtime/globals.js').boot();
    debug('booting bot.js');
    require('./runtime/bot');
})();
