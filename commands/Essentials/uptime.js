module.exports = async message => {
    try {
        let data = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            ms: Client.uptime
        };
        while (data.ms > 1000) {
            data.ms -= 1000;
            data.seconds++;
        }
        while (data.seconds > 60) {
            data.seconds -= 60;
            data.minutes++;
        }
        while (data.minutes > 60) {
            data.minutes -= 60;
            data.hours++;
        }
        while (data.hours > 24) {
            data.hours -= 24;
            data.days++;
        }
        return await response.send(response.create({
            message: message,
            title: 'Bot is up for',
            fields: [
                `${data.days} day(s), ${data.hours} hour(s), ${data.minutes} minute(s), ${data.seconds} second(s)`
            ],
            noKey: true,
            error: 'Failed to fetch information'
        }));
    } catch(error) {
        debug(error);
    }
}
