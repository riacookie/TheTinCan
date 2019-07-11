module.exports.identity = {};
module.exports.identity.lowerFlippedIdentities = misc.object.toLowerCaseKeys(misc.object.flipObject(bot_data.identities));

module.exports.identity.getName = str => {
    if (bot_data.identities[str]) return bot_data.identities[str];
    str = str.toLowerCase();
    let pos = this.identity.lowerFlippedIdentities[str];
    if (pos) return bot_data.identities[pos];
}

module.exports.identity.getPosition = str => {
    if (bot_data.identities[str]) return Number(str);
    str = str.toLowerCase();
    let pos = this.identity.lowerFlippedIdentities[str];
    if (pos) return Number(pos);
}

module.exports.identity.get = async userid => {
    let data = await firebase.get(`/users/${userid}`);
    if (data && data.id) return Number(data.id);
    return 0;
}

module.exports.identity.set = async (userid, identity) => {
    if (identity) {
        return await firebase.set(
            `/users/${userid}/id`,
            this.identity.getPosition(identity)
        );
    }
    return await firebase.remove(`/users/${userid}/id`);
}
module.exports.isBlacklisted = userid => bot_data.blacklists[userid] == true;

module.exports.addBlacklist = async userid => {
    bot_data.blacklists[userid] = true;
    await firebase.set(`/bot/blacklists/${userid}`, true);
}

module.exports.removeBlacklist = async userid => {
    if (bot_data.blacklists[userid]) {
        delete bot_data.blacklists[userid];
        await firebase.remove(`/bot/blacklists/${userid}`);
    }
}

module.exports.refresh = async () => global['bot_data'] = await firebase.get('/bot');
