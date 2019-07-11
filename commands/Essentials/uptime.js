module.exports = async ({message}) => {
    const uptime = moment.duration(client.uptime);
    return await response.create({
        message: message,
        fields: `Up for ${uptime.days()} days ${uptime.hours()} hours ${uptime.minutes()} minutes ${uptime.seconds()} seconds.`
    });
}
