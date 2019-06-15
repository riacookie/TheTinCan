module.exports.identity = {};

module.exports.identity.getName = str => {
    if (bot.identities[Number(str)]) {
        return bot.identities[Number(str)];
    } else {
        let lowerCaseKeysFlippedIdentities = toLowerCaseKeys(flipObject(bot.identities));
        if (lowerCaseKeysFlippedIdentities[str.toLowerCase()]) {
            return bot.identities[
                Number(lowerCaseKeysFlippedIdentities[str.toLowerCase()])
            ];
        }
    }
};

module.exports.identity.getPosition = str => {
    if (bot.identities[Number(str)]) {
        return Number(str);
    } else {
        let lowerCaseKeysFlippedIdentities = toLowerCaseKeys(flipObject(bot.identities));
        if (lowerCaseKeysFlippedIdentities[str.toLowerCase()]) {
            return Number(lowerCaseKeysFlippedIdentities[str.toLowerCase()]);
        }
    }
};

module.exports.identity.compare = (a, t, b) => {
    [a, b] = [this.identity.getPosition(a), this.identity.getPosition(b)];
    return t == '=='
        ? a == b
        : t == '>='
        ? a >= b
        : t == '<='
        ? a <= b
        : t == '!='
        ? a != b
        : t == '||'
        ? a || b
        : false;
};

module.exports.identity.get = async userid => {
    let data = await friebase.get(`/users/${userid}`);
    if (data && data.id) {
        return Number(data.id);
    }
    return 0;
};

module.exports.identity.set = async (userid, identity) => {
    identity = this.identity.getPosition(identity);
    return await firebase.set(`/users/${userid}/id`, identity);
};

module.exports.isBlacklisted = async userid => {
    return bot.blacklists[userid.toString()] ? true : false;
};

module.exports.addBlacklist = async userid => {
    bot.blacklists[userid.toString()] = true;
    await firebase.set(`/bot/blacklists/${userid}`, true);
};

module.exports.removeBlacklist = async userid => {
    if (bot.blacklists[userid.toString()]) {
        delete bot.blacklists[userid.toString()];
        await firebase.remove(`/bot/blacklists/${userid}`);
    }
};

module.exports.refresh = async () => {
    global['bot'] = await firebase.get('/bot');
};

