module.exports = async message => {
    try {
        let result = await mentions.getUser(message);
        let user = result.member ? result.member.user : result.user;
        let config;
        if (!result.member) {
            config = {
                message: message,
                fields: {
                    'Account Type': user.bot ? 'Bot' : 'Human',
                    Tag: user.tag,
                    ID: user.id,
                    Status: user.presence.status == 'offline' ? 'unknown' : user.presence.status,
                    'Account Created At': moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss'),
                    Avatar: user.displayAvatarURL
                },
                author: message.author,
                title: `${user.username}'s Information`,
                error: 'Something went wrong, failed to fetch user\'s info',
                thumbnail: user.displayAvatarURL,
                footer: {
                    icon_url: user.displayAvatarURL,
                    text: user.tag
                }
            }
        }
        else {
            config = {
                message: message,
                fields: {
                    'Account type': user.bot ? 'Bot' : 'Human',
                    Tag: user.tag,
                    ID: user.id,
                    Status: user.presence.status,
                    'Display name': result.member.displayName,
                    Roles: result.member.roles.map(r => r.name != '@everyone' ? r.name : 'everyone').join(', '),
                    'Guild joined at': moment.utc(result.member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss'),
                    'Account created at': moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss'),
                    Avatar: user.displayAvatarURL
                },
                author: message.author,
                title: `${user.username}'s Information`,
                error: 'Something went wrong, failed to fetch user\'s info',
                thumbnail: user.displayAvatarURL,
                footer: {
                    icon_url: user.displayAvatarURL,
                    text: user.tag
                }
            }
        }
        return await response.send(response.create(config));
    } catch (error) {
        debug(error);
    }
}
