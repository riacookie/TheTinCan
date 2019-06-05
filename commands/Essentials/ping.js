module.exports = async message => {
    try {
        let msg, flag;
        let cmd = shiftWord(message.content);
        cmd = firstWord(cmd).toLowerCase();
        let files = await firebase.get('/bot/commands/files');
        if (files[cmd] && files[cmd] != 'ping') {
            message.content = shiftWord(message.content);
            try {
                msg = await require(`../${files[cmd]}`)(message);
                flag = true;
            } catch (error) {
                debug(error);
                return await response.error({
                    message: message,
                    error: 'Something went wrong, failed to fetch command'
                });
            }
        }
        else {
            msg = await response.send({
                message: message,
                text: 'Ping?',
                error: 'Something went wrong, ping.js isn\'t working properly. (1)'
            });
        }
        let time = msg.createdTimestamp - message.createdTimestamp;
        if (flag) msg = _;
        return await response.send(response.create({
            author: message.author,
            message: message,
            title: 'Pong!',
            edit: msg,
            fields: {
                'Reply Speed': `${time}ms`,
                'Connection Speed': `${Math.round(Client.ping)}ms`
            },
            singleline: true,
            error: 'Something went wrong, ping.js isn\'t working properly. (2)'
        }))
    } catch (error) {
        debug(error);
    }
}
