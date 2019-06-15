module.exports = async message => {
    try {
        let userIdentity = await management.identity.get(message.author.id);
        if (userIdentity && management.identity.compare(userIdentity, '>=', 'Moderator')) {
            let t = firstWord(shiftWord(message.content)).toLowerCase();
            if (t == 'add' || t == 'remove') {
                let mention = await mentions.getUser(message);
                if (mention.code > 0) {
                    return await response.error({
                        message: message,
                        error: 'No user specified'
                    });
                }
                if (mention.user.id == message.author.id) {
                    return await response.error({
                        message: message,
                        error: 'You can\'t use this command on youself'
                    });
                }
                let targetIdentity = await management.identity.get(mention.user.id);
                if (targetIdentity && userIdentity > targetIdentity) {
                    let isBlacklisted = await management.isBlacklisted(mention.user.id);
                    if (t == 'add') {
                        if (isBlacklisted) {
                            return await response.error({
                                message: message,
                                error: 'Specified user is already blacklisted'
                            });
                        }
                        await management.addBlacklist(mention.user.id);
                        return await response.send(response.create({
                            message: message,
                            title: 'Blacklist',
                            fields: [
                                `Added ${mention.user.tag} (${mention.user.id}) to blacklist`
                            ],
                            noKey: true,
                            footer: {
                                icon_url: mention.user.displayAvatarURL,
                                text: mention.user.tag
                            },
                            error: 'Something went wrong, but the operation may have been completed successfully'
                        }));
                    }
                    else {
                        if (!isBlacklisted) {
                            return await response.error({
                                message: message,
                                error: 'Specified user isn\'t blacklisted'
                            });
                        }
                        await management.removeBlacklist(mention.user.id);
                        return await response.send(response.create({
                            message: message,
                            title: 'Blacklist',
                            fields: [
                                `Removed ${mention.user.tag} (${mention.user.id}) from blacklist`
                            ],
                            noKey: true,
                            footer: {
                                icon_url: mention.user.displayAvatarURL,
                                text: mention.user.tag
                            },
                            error: 'Something went wrong, but the operation may have been completed successfully'
                        }));
                    }
                }
                else {
                    return await response.error({
                        message: message,
                        error: 'Specified user has same or higher identty than yours'
                    });
                }
            }
            else {
                return await response.error({
                    message: message,
                    error: `Invalid arguments, see \`${prefix}help ${firstWord(message.content).replace(prefix, '')}\` for more information.`
                });
            }
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
