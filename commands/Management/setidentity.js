module.exports = async ({message, content}) => {
    const id = await management.identity.get(message.author.id);
    if (!id) {
        return await response.create({
            message: message,
            error: 'You don\'t have permission to use this command'
        });
    }
    const pos = management.identity.getPosition(misc.string.nthWord(content, 2));
    if (!pos) return await response.create({
        message: message,
        error: 'Invalid identity'
    });
    const name = management.identity.getName(pos);
    if (pos >= id) return await response.create({
        message: message,
        error: 'You aren\'t allowed to access specified identity'
    });
    const data = await mentions.getUsers(misc.string.shiftWords(content, 2), message, false, 1);
    const user = data.users[0];
    if (!user) return await response.create({
        message: message,
        error: 'Invalid user'
    });
    const target_id = await management.identity.get(user.id);
    if (target_id >= id) return await response.create({
        message: message,
        error: 'Specified user\'s identity must be lower than yours'
    });
    const blacklisted = management.isBlacklisted(user.id);
    if (target_id == pos) return await response.create({
        message: message,
        error: 'Specified user already has specified identity'
    });
    await management.identity.set(user.id, pos);
    return await response.create({
        message: message,
        fields: `Changed ${user.tag} (${user.id})'s identity from ${management.identity.getName(target_id)} (${target_id}) to ${name} (${pos})`,
        thumbnail: user.displayAvatarURL,
        footer: user.id != message.author.id ? user.tag : _,
        footer_icon: user.id != message.author.id ? user.displayAvatarURL : _
    });
}
