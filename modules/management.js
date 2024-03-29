module.exports.identityList = {};
for (const key in bot_data.identities) {
    if (!bot_data.identities[key].permissions) bot_data.identities[key].permissions = [];
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
    let id = await firebase.get(`/users/${userid}/id`);
    if (id) return bot_data.identities[this.identityList[id]];
    return bot_data.identities[this.identityList[0]];
}
module.exports.identity.set = async (userid, identity) => {
    if (identity) return await firebase.set(`/users/${userid}/id`, identity);
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
module.exports.leave = async guildid => {
    const guild = client.guilds.find(g => g.id == guildid);
    if (guild) await guild.leave();
}
