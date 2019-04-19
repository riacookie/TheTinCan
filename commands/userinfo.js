exports.run = (message) => {
    try {
        resolve.getUser(message).then((result) => {
            let user = result.users[0];
            let config = {
                "author": user.user ? user.user : user,
                "thumbnail": (user.displayAvatarURL || user.user.displayAvatarURL),
                "title": `${user.username || user.user.username}'s information`,
                "footer": {
                    "icon_url": message.author.displayAvatarURL,
                    "text": message.author.tag
                },
                "fields": {
                    "Account Type": (user.user ? user.user.bot : user.bot) ? "Bot" : "Human",
                    "Tag": user.tag || user.user.tag,
                    "ID": user.id,
                    "Account Created At": moment.utc(user.createdAt || user.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")
                },
                "mention": true,
                "linebreak": true,
                "seperator": ":"
            };
            if (result.guild) {
                config.fields["Status"] = user.presence.status || user.user.presence.status,
                config.fields["Roles"] = user.roles.map(r => r.name != "@everyone" ? r.name : "everyone").join(", ");
                config.fields["Joined At"] = moment.utc(user.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
            }
            response.send(message, response.create(config));
        }).catch((err) => {
            debug(err);
            response.error(message, "failed to fetch user");
        });
    } catch (error) {
        debug(error);
    }
}
