module.exports = (...ar) => new Promise((a, c) => request(...ar, (e, r, b) => e ? c(e) : a([r, b])));
module.exports.get = (...ar) => new Promise((a, c) => request.get(...ar, (e, r, b) => e ? c(e) : a([r, b])));
module.exports.post = (...ar) => new Promise((a, c) => request.post(...ar, (e, r, b) => e ? c(e) : a([r, b])));
