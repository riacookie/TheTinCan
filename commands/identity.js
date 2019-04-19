exports.run = (message) => {
    try {
        resolve.getUser(message).then(result => {
            let user = result.users[0];
            let config = {
                "author": user,
                "title": `${user.tag || user.user.tag}'s identity`,
                "mention": true,
                "seperator": ":",
                "linebreak": true,
                "error": "Something went wrong, identity.js isn't working properly (ErrorCode : identity.js - 1)",
                "fields": {}
            };
            identity.bot.get(user.id, (data, error) => {
                if (error) {
                    debug(error);
                }
                identity.getRank.bot(data, (rank) => {
                    config.fields["Bot Rank"] = rank.name;
                    if (result.guild) {
                        identity.server.get(message.guild.id, user.id, (_data, _error) => {
                            if (_error) {
                                debug(_error);
                            }
                            identity.getRank.server(_data, (_rank) => {
                                config.fields["Server Rank"] = _rank.name;
                                response.send(message, response.create(config));
                            })
                        })
                    }
                    else {
                        response.send(message, response.create(config));
                    }
                })
            })
        }).catch(error => {
            debug(error);
        });
    } catch (error) {
        debug(error);
    }
}
