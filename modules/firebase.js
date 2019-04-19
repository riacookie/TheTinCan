exports.get = (path, callback) => {
    database.ref(path).once("value", data => {
        if (data.exists()) {
            callback(data.val(), _);
        }
        else {
            callback(_, _);
        }
    },
    error => {
        callback(_, error);
        debug(`${error.code} : ${error.message}`);
    })
}

exports.set = (path, data, callback) => {
    database.ref(path).set(data, err => {
        callback(err);
    })
}

exports.remove = (path, callback) => {
    database.ref(path).remove(err => {
        callback(err);
    })
}

exports.exists = (path, callback) => {
    database.ref(path).once("value", data => {
        callback(data.exists());
    })
}

