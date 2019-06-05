/*
module.exports.get = (path) => new Promise((resolve, reject) => {
    database.ref(path).once("value", data => {
        if (data.exists()) {
            resolve(data.val());
        }
        else {
            reject();
        }
    },
    error => {
        reject(error);
    })
})
*/

module.exports.get = path => new Promise((resolve, reject) => {
    let data = require('../database.json');
    let key = path.replace(/\//g, '.');
    if (key.startsWith('.')) key = key.replace('.', '');
    resolve(eval(`data.${key}`))
})

module.exports.set = (path, data) => new Promise((resolve, reject) => {
    database.ref(path).set(data, err => {
        err ? reject(err) : resolve();
    })
})

module.exports.remove = (path) => new Promise((resolve, reject) => {
    database.ref(path).remove(err => {
        err ? reject(err) : resolve();
    })
})

module.exports.exists = (path) => new Promise((resolve, reject) => {
    database.ref(path).once("value", data => {
        resolve(data.exists());
    },
    error => {
        reject(error);
    })
})
