module.exports = async message => {
    try {
        if (message.guild) {
            return await response.send(response.create({
                message: message,
                error: 'Failed to fetch guild information',
                title: `${message.guild.name}'s Information`,
                fields: {
                    Name: message.guild.name,
                    ID: message.guild.id,
                    Owner: (await Client.fetchUser(message.guild.ownerID)).tag,
                    'Owner ID': message.guild.ownerID,
                    Members: message.guild.memberCount,
                    Roles: message.guild.roles.size - 1,
                    Icon: message.guild.iconURL,
                    'Created At': moment.utc(message.guild.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"),
                    Region: message.guild.region
                },
                thumbnail: message.guild.iconURL
            }));
        }
        else {
            return await response.error({
                message: message,
                error: 'This command can only be used in a guild'
            })
        }
    } catch(error) {
        debug(error);
    }
}
