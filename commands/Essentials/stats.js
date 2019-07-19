module.exports = async ({message}) => await response.create({
    message: message,
    title: 'My statistics',
    fields: {
        'Uptime': (uptime => `${uptime.days()} days ${uptime.hours()} hours ${uptime.minutes()} minutes ${uptime.seconds()} seconds.`)(moment.duration(client.uptime)),
        'Guilds': client.guilds.size,
        'Connection Speed': `${Math.round(client.ping)}ms`,
        'Discord.js version': discord.version,
        'Node.js version': process.version
    },
    thumbnail: client.user.displayAvatarURL
});
