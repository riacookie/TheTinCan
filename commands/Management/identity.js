module.exports = async message => {
    try {
        let userMention = await mentions.getUser(message);
        let userIdentity = await management.identity.get(userMention.user.id);
        return await response.send(response.create({
            message: message,
            title: `${userMention.user.tag} (${userMention.user.id}) 's identity information`,
            fields: {
                Identity: `${await management.identity.getName(userIdentity)} (${userIdentity})`,
                Blacklisted: await management.isBlacklisted(userMention.user.id)
            },
            footer: {
                icon_url: userMention.user.displayAvatarURL,
                text: userMention.user.tag
            },
            error: 'Something went, failed to reply with specified user\'s identity'
        }));
    } catch (error) {
        debug(error);
    }
}
