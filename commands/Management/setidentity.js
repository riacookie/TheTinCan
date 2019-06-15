module.exports = async message => {
    try {
        let userIdentity = await management.identity.get(message.author.id);
        if (userIdentity > 1) {
            let identityMention = await mentions.getIdentity(message);
            let userMention = await mentions.getUser(message);
            if (identityMention.code < 0 || userMention.code < 0) {
                return await response.error({
                    message: message,
                    error: 'Invalid identity/user specified'
                });
            }
            if (userMention.user.id == message.author.id) {
                return await response.error({
                    message: message,
                    error: 'You can\'t edit own identity'
                });
            }
            if (identityMention.identity >= userIdentity) {
                return await response.error({
                    message: message,
                    error: 'Specified identity is same or higher than yours'
                });
            }
            let targetIdentity = await management.identity.get(userMention.user.id);
            if (userIdentity <= targetIdentity) {
                return await response.error({
                    message: message,
                    error: 'Specified user\'s identity is same or higher than yours'
                });
            }
            await management.identity.set(userMention.user.id, identityMention.identity);
            return await response.send(response.create({
                message: message,
                title: 'Identity change',
                fields: [
                    `${userMention.user.tag} (${userMention.user.id}) 's identity has been changed to ${await management.identity.getName(identityMention.identity)}`
                ],
                noKey: true,
                footer: {
                    icon_url: userMention.user.displayAvatarURL,
                    text: userMention.user.tag
                },
                error: 'Something went wrong, but the operation may have been completed successfully'
            }));
        }
        else {
            return await response.error({
                message: message,
                error: 'You don\'t meet the minimum identity requirement for using this command'
            });
        }
    } catch (error) {
        debug(error);
    }
}
