module.exports = async ({message, content}) => {
    const identity = await management.identity.get(message.author.id);
    if (!identity.permissions.includes('EDIT_IDENTITY')) {
        return await response.create({
            message: message,
            error: 'You don\'t have permission to use this command'
        });
    }
    const mentioned_identity = management.identity(misc.string.nthWord(content, 2));
    if (!mentioned_identity) return await response.create({
        message: message,
        error: 'Invalid identity'
    });
    if (mentioned_identity.id >= identity.id) return await response.create({
        message: message,
        error: 'You aren\'t allowed to access specified identity'
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
    if (target_identity.id == mentioned_identity.id) return await response.create({
        message: message,
        error: 'Specified user already has specified identity'
    });
    await management.identity.set(user.id, pos);
    return await response.create({
        message: message,
        fields: `Changed ${user.tag} (${user.id})'s identity from ${target_identity.name} (${target_identity.id}) to ${mentioned_identity.name} (${mentioned_identity.id})`,
        thumbnail: user.displayAvatarURL,
        footer: user.id != message.author.id ? user.tag : _,
        footer_icon: user.id != message.author.id ? user.displayAvatarURL : _
    });
}
