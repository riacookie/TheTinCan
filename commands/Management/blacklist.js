module.exports = async ({message, content}) => {
    const identity = await management.identity.get(message.author.id);
    if (!identity.permissions.includes('BLACKLIST')) {
        return await response.create({
            message: message,
            error: 'You don\'t have permission to use this command'
        });
    }
    const type = misc.string.nthWord(content, 2).toLowerCase();
    if (type != 'add' && type != 'remove') return await response.create({
        message: message,
        error: `2nd parameter invalid, syntax : ${bot_data.commands.blacklist.syntax}`
    });
    const data = await mentions.getUsers(misc.string.shiftWords(content, 2), message, false, 1);
    const user = data.users[0];
    if (!user) return await response.create({
        message: message,
        error: 'Invalid user'
    });
    const target_identity = await management.identity.get(user.id);
    if (target_identity.id >= identity.id) return await response.create({
        message: message,
        error: 'Specified user\'s identity must be lower than yours'
    });
    const blacklisted = management.isBlacklisted(user.id);
    if (type == 'add' && blacklisted) return await response.create({
        message: message,
        error: 'Specified user is already blacklisted'
    });
    if (type == 'remove' && !blacklisted) return await response.create({
        message: message,
        error: 'Specified user isn\'t in blacklist'
    });
    type == 'add' ? await management.addBlacklist(user.id) : management.removeBlacklist(user.id);
    return await response.create({
        message: message,
        fields: `${type == 'add' ? 'Added' : 'Removed'} ${user.tag} (${user.id}) ${type == 'add' ? 'to' : 'from'} blacklist`,
        thumbnail: user.displayAvatarURL,
        footer: user.id != message.author.id ? user.tag : _,
        footer_icon: user.id != message.author.id ? user.displayAvatarURL : _
    });
}
