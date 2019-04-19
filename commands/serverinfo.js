exports.run = (message) => {
    try {
        if (message.guild) {
            let ownerID = message.guild.ownerID;
            client.fetchUser(ownerID).then((owner) => {
                let roles = message.guild.roles.map(role => role.name);
                roles.shift();
                response.send(message,
                    response.create({
                        "mention": true,
                        "author": owner,
                        "thumbnail": message.guild.iconURL,
                        "footer": {
                            "icon_url": message.author.displayAvatarURL,
                            "text": message.author.tag
                        },
                        "seperator": ":",
                        "linebreak": true,
                        "fields": {
                            "Guild Name": message.guild.name,
                            "Guild ID": message.guild.id,
                            "Owner Tag": owner.tag,
                            "Owner ID": ownerID,
                            "Members": message.guild.memberCount,
                            "Region": message.guild.region,
                            "Created At": moment.utc(message.guild.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"),
                            "Roles": "```\r\n" + roles.join(", ") + "```"
                        },
                        "error": "Something went wrong, serverinfo.js isn't working properly"
                    })
                )
            }).catch((err) => {
                debug(err);
            });
        }
        else {
            response.error(message, "This command can only be used in a guild");
        }
    } catch (error) {
        debug(error);
    }
}
