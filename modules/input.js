module.exports.reactionInteraction = async (message, userid, arr) => {
    for (const i of arr) {
        if (!message.reactions.find(r => r.emoji.name == i && r.me)) await message.react(i).catch($);
    }
    return message.createReactionCollector(
        (r, u) => arr.indexOf(r.emoji.name) != -1 && u.id == userid,
        { max: 1, time: 15000 }
    );
}
module.exports.cleanUp = async (message, callback, ...args) => {
    message.clearReactions().then(() => callback(...args)).catch(async () => {
        for (const [i, r] of message.reactions) {
            if (r.me) await r.remove().catch($);
        }
        callback(...args);
    });
}
module.exports.pageInteraction = async ({command, message, cmd_message, current, min, max, callback}) => {
    const collector = await this.reactionInteraction(message, cmd_message.author.id, [
        characters.left_double,
        characters.left,
        characters.right,
        characters.right_double
    ]);
    collector.once('collect', async reaction => {
        await reaction.remove(cmd_message.author.id).catch($);
        let i = reaction.emoji.name;
        let page = i == characters.left_double
            ? min
            : i == characters.left
            ? --current
            : i == characters.right
            ? ++current
            : max;
        page = page < min ? max : page > max ? min : page;
        callback(page);
    });
    collector.once('end', async (c, reason) => {
        if (reason == 'time') this.cleanUp(message, callback, _, 'timeout');
    });
}
module.exports.confirmationInteraction = async ({command, message, cmd_message, callback}) => {
    const collector = await this.reactionInteraction(message, cmd_message.author.id, [
        characters.accept,
        characters.reject
    ]);
    collector.once('collect', reaction => this.cleanUp(message, callback, reaction.emoji.name == characters.accept))
    collector.once('end', (c, reason) => {
        if (reason == 'time') this.cleanUp(message, callback, _, 'timeout');
    });
}
