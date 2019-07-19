module.exports.identityList = {};
for (const key in bot_data.identities) {
    this.identityList[key.toLowerCase()] = key;
    const id = bot_data.identities[key];
    this.identityList[id.id] = key;
    if (id.aliases) {
        for (const alias of id.aliases) {
            this.identityList[alias.toLowerCase()] = key;
        }
    }
    bot_data.identities[key].name = key;
}

module.exports.identity = str => {
    const id = this.identityList[str.toLowerCase()];
    if (id) return bot_data.identities[id];
}

module.exports.identity.get = async userid => {
    let data = await firebase.get(`/users/${userid}`);
    if (data && data.id) return bot_data.identities[data.id];
    return bot_data.identities[0];
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
module.exports.disable = async guild => {
    if (!bot_data.sever_blacklists[guild]) {
        bot_data.sever_blacklists[guild] = true;
        await firebase.set(`/bot/sever_blacklists/${guild}`, true);
    }
}
module.exports.leave = async guildid => {
    const guild = client.guilds.find(g => g.id == guildid);
    if (guild) {
        await guild.leave();
    }
}
module.exports.enable = async guild => {
    if (!bot_data.sever_blacklists[guild]) {
        delete bot_data.sever_blacklists[guild];
        await firebase.remove(`/bot/sever_blacklists/${guild}`);
    }
}
