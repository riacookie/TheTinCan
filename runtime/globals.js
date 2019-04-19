exports.boot = async() => {
    global["_"] = undefined;
    let packages = {
        'Discord': 'discord.js',
        'firebase_admin': 'firebase-admin',
        'request': 'request',
        'moment': 'moment',
        'os': 'os'
    }
    Object.keys(packages).forEach(key => {
        global[key] = require(packages[key]);
    })
    debug("initialized npm modules");

    firebase_admin.initializeApp({
        credential: firebase_admin.credential.cert(JSON.parse(process.env.firebase_key)),
        databaseURL: process.env.firebase_url
    });
    global["database"] = firebase_admin.database();
    global["firebase"] = require("../modules/firebase");
    debug("initialized firebase");

    global["toHex"] = (text, s = "%") => Buffer.from(text, 'utf8').toString('hex').split('').reverse().join('').replace(/(.{2})/g,`$1${s}`).split('').reverse().join('')
    global["client"] = new Discord.Client();
    global["random"] = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    let requestAsyncGet = async(url, timeout = 5000) => {
        let sleep = (t) => new Promise(r => setTimeout(r, t));
        let waitFor = async(callback, delay = 50) => {
            while(!callback()) {
                await sleep(delay);
            }
            return;
        }
        debug(`requestAsync.get("${url}")`)
        let f = false;
        let results;
        request.get({ url: url, json: true, headers: {'User-Agent': 'request'}}, (err, res, body) => {
            results = [err, res, body];
            f = true;
        });
        await waitFor(() => {
            if (f || timeout <= 0) {
                return true;
            }
            timeout -= 50;
            return false;
        }, 50);
        return results;
    }
    let r = await requestAsyncGet('https://wandbox.org/api/list.json');
    let err, res, body; err = r[0]; res = r[1]; body = r[2];
    debug(`fetched https://wandbox.org/api/list.json with status ${res.statusCode} | error : ${err}`)
    let j = {};
    let l = {};
    let m = [];
    let n = [];
    body.forEach(obj => {
        m.push(obj.name);
        n.push(obj.name.toLowerCase());
        if (j[obj.language]) {
            j[obj.language].push(obj.name);
            l[obj.language.toLowerCase()].push(obj.name.toLowerCase());
        }
        else {
            j[obj.language] = [obj.name];
            l[obj.language.toLowerCase()] = [obj.name.toLowerCase()];
        }
    });
    global["wandbox"] = {
        "compilers" : {
            "normal": j,
            "lower": l
        },
        "languages" : {
            "normal": Object.keys(j),
            "lower": Object.keys(l),
        },
        "compilers_arr": {
            "normal": m,
            "lower": n
        },
        "compile": (options, timeout, callback) => {
            request.post("https://wandbox.org/api/compile.json", {
                "body": options,
                "timeout": timeout,
                "json": true
            },
            (error, res, body) => {
                callback(error, res, body);
            });
        }
    }
    debug(`initialized wandbox variables`);

    global["response"] = require("../modules/response");
    global["identity"] = require("../modules/identity");
    global["resolve"] = require("../modules/resolve");
    debug(`initilized response, identity modules`);

}
