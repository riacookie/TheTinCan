exports.bot = {
    "get": (userid, callback) => {
        firebase.get(`/users/${userid}/botid/current`, (data, error) => {
            callback(data, error);
        })
    },
    "getTemp": (userid, callback) => {
        firebase.get(`/users/${userid}/botid/temp`, (data, error) => {
            callback(data, error);
        })
    },
    "set": (userid, id, callback) => {
        id = Number(id);
        firebase.set(`/users/${userid}/botid/temp`, id, (error) => {
            callback(error);
        })
    },
    "setTemp": (userid, id, callback) => {
        id = Number(id);
        firebase.set(`/users/${userid}/botid/temp`, id, (error) => {
            callback(error);
        })
    },
    "clearTemp": (userid, callback) => {
        firebase.remove(`/users/${userid}/botid/temp`, (error) => {
            callback(error);
        })
    }
}
exports.server = {
    "get": (guildid, userid, callback) => {
        firebase.get(`/guilds/${guildid}/members/${userid}/id`, (data, error) => {
            callback(data, error);
        })
    },
    "set": (guildid, userid, id, callback) => {
        id = Number(id);
        firebase.set(`/guilds/${guildid}/members/${userid}/id`, id, (error) => {
            callback(error);
        })
    }
}

exports.getRank = {
    "bot": (rank = 0, callback) => {
        rank = rank.toString().toLowerCase();
        firebase.get("/bot/ranks/bot", (data, error) => {
            if (data) {
                let keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = data[key];
                    if (key.toLowerCase() == rank || value.toString() == rank) {
                        callback({
                            "name": key,
                            "id": value
                        });
                        return;
                    }
                }
            }
            callback({
                "name": "User",
                "id": 0
            });
        })
    },
    "server": (rank = 0, callback) => {
        rank = rank.toString().toLowerCase();
        firebase.get("/bot/ranks/server", (data, error) => {
            if (data) {
                let keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = data[key];
                    if (key.toLowerCase() == rank || value.toString() == rank) {
                        callback({
                            "name": key,
                            "id": value
                        });
                        return;
                    }
                }
            }
            callback({
                "name": "Member",
                "id": 0
            });
        })
    }
}

