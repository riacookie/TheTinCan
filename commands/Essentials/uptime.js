module.exports = async ({message}) => return await response.create({
    message: message,
    fields: (uptime => `Up for ${uptime.days()} days ${uptime.hours()} hours ${uptime.minutes()} minutes ${uptime.seconds()} seconds.`)(moment.duration(client.uptime))
});
