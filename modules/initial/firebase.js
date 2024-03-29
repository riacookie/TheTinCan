firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(
        JSON.parse(Buffer.from(process.env.firebase_key, 'hex').toString())
    ),
    databaseURL: process.env.firebase_url
});

global['db'] = firebase_admin.database();

module.exports.cache = {};

module.exports.get = p => new Promise((a, c) => db.ref(p).once('value', d => d.exists() ? a(d.val()) : a(), c));
module.exports.set = (p, v) => new Promise((a, c) => db.ref(p).set(v, e => e ? c(e) : a()))
module.exports.push = (p, v) => new Promise((a, c) => db.ref(p).push(v, e => e ? c(e) : a()));
module.exports.remove = p => new Promise((a, c) => db.ref(p).remove(e => e ? c(e) : a()));
module.exports.exists = p => new Promise((a, c) => db.ref(p).once('value', data => a(data.exists()), c))
