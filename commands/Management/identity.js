module.exports = async ({message, content}) => {
    let data = await mentions.getUsers(misc.string.shiftWord(content), message, false, 1);
    if (!data.users.length) data.users.push(message.author);
    const user = data.users[0];
    const id = await management.identity.get(user.id);
    return await response.create({
        message: message,
        title: `${user.username}'s identical information`,
        fields: {
            'Bot Identity': `${management.identity.getName(id)} (${id})`,
            Blacklisted: management.isBlacklisted(user.id)
        },
        thumbnail: user.displayAvatarURL,
        footer: user.id != message.author.id ? user.tag : _,
        footer_icon: user.id != message.author.id ? user.displayAvatarURL : _
    });
}
