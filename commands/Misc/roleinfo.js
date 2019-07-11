module.exports = async ({message, content}) => {
    if (!message.guild) return await response.create({
        message: message,
        error: 'This command can only be used in guilds'
    });
    let roles = await mentions.getRoles(misc.string.shiftWord(content), message, 1);
    if (!roles || !roles.length) return await response.create({
        message: message,
        error: 'Invalid role'
    });
    const role = roles[0];
    return await response.create({
        message: message,
        title: `Information about ${role.name} role`,
        fields: {
            Name: role.name,
            ID: role.id,
            Color: role.hexColor,
            Mentionable: role.mentionable,
            'Displayed members seperately': role.hoist,
            'Created At': moment.utc(role.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")
        },
        color: role.color
    });
}
