module.exports = async () => {
    let packages = {
        express: 'express',
        request: 'request',
        firebase_admin: 'firebase-admin',
        discord: 'discord.js',
        moment: 'moment',
        os: 'os',
        fs: 'fs',
        events: 'events'
    };
    for (let [name, package] of Object.entries(packages)) global[name] = require(package);
    debug('initialized npm packages.');

    global['$'] = () => {};
    global['_'] = undefined;
    let _chars = {
        square: [9642],
        circle: [8226],
        '0': [48, 8419],
        '1': [49, 8419],
        '2': [50, 8419],
        '3': [51, 8419],
        '4': [52, 8419],
        '5': [53, 8419],
        '6': [54, 8419],
        '7': [55, 8419],
        '8': [56, 8419],
        '9': [57, 8419],
        '10': [55357, 56607],
        left: [9664],
        right: [9654],
        up: [55357, 56636],
        down: [55357, 56637],
        left_double: [9194],
        right_double: [9193],
        up_double: [9195],
        down_double: [9196],
        accept: [9989],
        reject: [55357, 57003],
        subdir: [9493, 9473],
        zwsp: [8203]
    }
    global['characters'] = {};
    for (let [char, code] of Object.entries(_chars)) global['characters'][char] = String.fromCharCode(...code);
    
    global['prefix'] = process.env.prefix;
    global['options_prefix'] = process.env.options_prefix;
    global['client'] = new discord.Client({
        disableEveryone: true
    });
    debug('created client.');

    for (let file of fs.readdirSync('./modules/initial')) {
        const name = file.slice(0, file.lastIndexOf('.'));
        global[name] = require(`../modules/initial/${file}`);
    }
    debug(`initialized initial modules.`);

    global['bot_data'] = await firebase.get('/bot');
    debug(`initialized database cache.`);

    for (let file of fs.readdirSync('./modules')) {
        if (file != 'initial') {
            const name = file.slice(0, file.lastIndexOf('.'));
            global[name] = require(`../modules/${file}`);
            if (global[name].init) await global[name].init();
        }
    }
    debug(`initialized custom modules.`);
}
