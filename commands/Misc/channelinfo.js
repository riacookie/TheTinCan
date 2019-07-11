module.exports = async ({message, content}) => {
    if (!message.guild) return await response.create({
        message: message,
        error: 'This command can only be used in guilds'
    });
    let channels = await mentions.getChannels(content, message, 1);
    if (!channels || !channels.length) return await response.create({
        message: message,
        error: 'Invalid channel'
    });
    const channel = channels[0];
    return await response.create({
        message: message,
        title: `Information about #${channel.name} channel`,
        fields: {
            Name: channel.name,
            ID: channel.id,
            Type: channel.type,
            'Created At': moment.utc(channel.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"),
            'Category': channel.parent ? channel.parent.name : 'None'
        }
    });
}
