module.exports = async ({message}) => await response.create({
    message: message,
    title: 'My statistics',
    fields: {
        'Uptime': (uptime => `Up for ${uptime.days()} days ${uptime.hours()} hours ${uptime.minutes()} minutes ${uptime.seconds()} seconds.`)(moment.duration(client.uptime)),
        'Guilds': client.guilds.size,
        'Connection Speed': `${Math.round(client.ping)}ms`,
        'Memory Usage': `${((os.totalmem() - os.freemem())/1073741824).toFixed(2)}GB/${(os.totalmem()/1073741824).toFixed(2)}GB`,
        'Node.js version': process.version,
        'Discord.js version': discord.version
    },
    thumbnail: client.user.displayAvatarURL
});
