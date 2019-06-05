module.exports = (...args) => new Promise((resolve, reject) => {
    request(...args, (error, res, body) => {
        if (error) {
            reject(error);
        }
        else {
            resolve([res, body]);
        }
    })
})
module.exports.get = (...args) => new Promise((resolve, reject) => {
    request.get(...args, (error, res, body) => {
        if (error) {
            reject(error);
        }
        else {
            resolve([res, body]);
        }
    })
})
module.exports.post = (...args) => new Promise((resolve, reject) => {
    request.post(...args, (error, res, body) => {
        if (error) {
            reject(error);
        }
        else {
            resolve([res, body]);
        }
    })
})
