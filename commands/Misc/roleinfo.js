module.exports = async message => {
    try {
        if (message.guild) {
            let role = await mentions.getRole(message);
            if (role.role) {
                role = role.role
                return await response.send(response.create({
                    message: message,
                    error: 'Failed to fetch role information',
                    title: `Information about role "${role.name}"`,
                    color: role.color,
                    fields: {
                        Name: role.name,
                        ID: role.id,
                        Color: role.hexColor,
                        Mentionable: role.mentionable,
                        'Displayed members seperately': role.hoist,
                        'Created At': moment.utc(role.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")
                    }
                }));
            }
            else {
                return await response.error({
                    message: message,
                    error: 'Invalid role'
                })
            }
        }
        else {
            return await response.error({
                message: message,
                error: 'This command can only be used in a guild'
            })
        }
    } catch (error) {
        debug(error);
    }
}
