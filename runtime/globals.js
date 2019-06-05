module.exports.init = async () => {
    let packages = {
        request: 'request',
        firebase_admin: 'firebase-admin',
        Discord: 'discord.js',
        moment: 'moment',
        os: 'os'
    }
    let package_keys = Object.keys(packages);

    for (let i = 0; i < package_keys.length; i++) {
        const key = package_keys[i];
        const name = packages[key];
        global[key] = require(name);
    }
    debug(`initilized npm packages.`);
    
    global['_'] = undefined;
    global['prefix'] = process.env.prefix;
    global['randomInt'] = (x, y) => Math.floor(x + Math.random() * (y + 1 - x));
    global['randomElement'] = obj => {
        let keys = Object.keys(obj);
        return obj[keys[randomInt(0, keys.length - 1)]];
    }
    global['base64'] = {
        encode: t => Buffer.from(t).toString('base64'),
        decode: t => Buffer.from(t, 'base64').toString()
    }
    global['urlEncode'] = t => {
        let r = '';
        let arr = t.split('');
        for (let i = 0; i < arr.length; i++) {
            r += `%${Buffer.from(arr[i]).toString('hex')}`;
        }
        return r;
    }
    global['firstWord'] = t => {
        if (t.match(/\r\n|\r|\n|\t| /)) {
            return t.slice(0, t.match(/\r\n|\r|\n|\t| /).index);
        }
        else {
            return t;
        }
    }
    global['shiftWord'] = t => {
        let r = t.replace(firstWord(t), '');
        return r.slice(1, r.length);
    };
    global['Client'] = new Discord.Client();

    debug(`initilized side functions`);

    firebase_admin.initializeApp({
        credential: firebase_admin.credential.cert(JSON.parse(process.env.firebase_key)),
        databaseURL: process.env.firebase_url
    });
    global['database'] = firebase_admin.database();
    global['firebase'] = require('../modules/firebase');
    global['mentions'] = require('../modules/mentions');
    global['requestAsync'] = require('../modules/requestAsync');
    global['response'] = require('../modules/response');

    debug(`initilized custom modules`);

    global['bot'] = await firebase.get('/bot');

    let [r, b] = await requestAsync.get({
        url: 'https://wandbox.org/api/list.json',
        json: true,
        headers: {'User-Agent': 'request'}
    }).catch(console.error);

    global['wandbox'] = {
        compilers: {
            normal: {},
            lower: {}
        },
        languages: {
            normal: [],
            lower: []
        },
        compilers_arr: {
            normal: [],
            lower: []
        },
        compile: async (options, timeout) => {
            let result = await requestAsync.post({
                url: 'https://wandbox.org/api/compile.json',
                body: options,
                json: true,
                timeout: timeout
            }).catch(debug);
            return result;
        }
    }
    
    for (let i = 0; i < b.length; i++) {
        const compiler = b[i];
        wandbox.compilers_arr.normal.push(compiler.name);
        wandbox.compilers_arr.lower.push(compiler.name.toLowerCase());
        if (!wandbox.compilers.normal[compiler.language]) {
            wandbox.compilers.normal[compiler.language] = [];
            wandbox.compilers.lower[compiler.language.toLowerCase()] = [];
            wandbox.languages.normal.push(compiler.language);
            wandbox.languages.lower.push(compiler.language.toLowerCase());
        }
        wandbox.compilers.normal[compiler.language].push(compiler.name);
        wandbox.compilers.lower[compiler.language.toLowerCase()].push(compiler.name.toLowerCase());
    }
    [r, b] = [_, _];

    debug(`initilized wandbox`);
}

