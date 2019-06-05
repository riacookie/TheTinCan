(async() => {
    global["debug"] = require("./runtime/debug.js").debug;
    debug(`Initilized debug.js`);
    if (!process.env.live) {
        debug(`Project isn't live, parsing environment variables with dotenv...`);
        require("dotenv").config()
        debug(`Parsed environment variables`);
    }
    await require("./runtime/globals.js").init();
    debug(`Initilized globals.js`);
    require("./runtime/bot.js");
    debug(`Called bot.js`);
})();
