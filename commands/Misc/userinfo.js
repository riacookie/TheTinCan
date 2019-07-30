module.exports = async ({message, content}) => {
    let data = {
        members: [],
        users: []
    };
    if (misc.string.wordAmount(content) > 1) {
        data = await mentions.getUsers(misc.string.shiftWord(content), message, true, 1);
        if (!data.users.length) return await response.create({
            message: message,
            error: 'Can\'t find specified user'
        });
    }
    if (message.guild && message.guild.available && !data.members.length && !data.users.length) data.members.push(await message.guild.fetchMember(message.author));
    if (data.members.length > 0) {
        const member = data.members[0];
        return await response.create({
            message: message,
            title: `${member.user.username}'s information`,
            fields: {
                'Account Type': member.user.bot ? 'Bot' : 'Human',
                Tag: member.user.tag,
                ID: member.user.id,
                Status: member.user.presence.status,
                'Display Name': member.displayName,
                Roles: member.roles.map(r => r.name).filter(n => n != '@everyone').join(', ') || 'None',
                'Guild joined at': moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss') + ' (UTC)',
                'Account created at': moment.utc(member.user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss') + ' (UTC)',
                Avatar: member.user.displayAvatarURL
            },
            thumbnail: member.user.displayAvatarURL,
            footer: member.user.id != message.author.id ? member.user.tag : _,
            footer_icon: member.user.id != message.author.id ? member.user.displayAvatarURL : _
        });
    }
    if (data.users.length == 0) data.users.push(message.author);
    const user = data.users[0];
    return await response.create({
        message: message,
        title: `${user.username}'s information`,
        fields: {
            'Account Type': user.bot ? 'Bot' : 'Human',
            Tag: user.tag,
            ID: user.id,
            Status: user.presence.status == 'offline' ? 'unknown' : user.presence.status,
            'Account created at': moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss') + ' (UTC)',
            Avatar: user.displayAvatarURL
        },
        thumbnail: user.displayAvatarURL,
        footer: user.id != message.author.id ? user.tag : _,
        footer_icon: user.id != message.author.id ? user.displayAvatarURL : _
    });
}
