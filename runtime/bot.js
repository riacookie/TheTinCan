module.exports = async () => {
    client.login(process.env.token);
    debug('logging in...');
    client.on('ready', async () => {
        debug(`logged in as ${client.user.tag} (${client.user.id}).`);
        try {
            await client.user.setPresence({
                game: {
                    type: 'WATCHING',
                    name: 'dreams.'
                },
                status: 'online'
            });
            await response.create({
                channel: client.guilds.get(bot_data.debug.guild).channels.get(bot_data.debug.channel),
                author: client.user,
                title: `Login from host "${process.env.host}"`,
                fields: {
                    'Logged in as': {
                        Username: client.user.tag,
                        'User id': client.user.id
                    },
                    'Host prefix': prefix
                },
                footer: [`Logged in as ${client.user.id}`,  `host: ${process.env.host}`]
            });
            debug('sent init message.');
            debug(`boot successful, total time taken : ${(new Date().getTime()) - boot_time}ms.`);
            delete global['boot_time'];
        } catch (error) {
            debug(error);
        }
    });
    client.on('message', async message => {
        try {
            if (!message.author.bot && !management.isBlacklisted(message.author.id)) {
                let firstWord = misc.string.nthWord(message.content, 1, / |\r|\n|\t|`/).toLowerCase();
                let flag = firstWord.startsWith(prefix);
                let content;
                if (!flag && firstWord.replace(/<|!|@|>/g, '').startsWith(client.user.id)) {
                    flag = true;
                    firstWord = misc.string.nthWord(message.content, 2, / |\r|\n|\t|`/);
                    content = misc.string.shiftWords(message.content, 1, / |\r|\n|\t|`/);
                }
                if (flag) {
                    let cmd = firstWord.replace(prefix, '');
                    if (commands.names[cmd]) await run({
                        message: message,
                        content: content,
                        cmd: cmd
                    });
                    else {
                        let lang = cmd;
                        if (!wandbox.lower.languages.includes(lang)) lang += ` ${misc.string.nthWord(message.content, 2)}`;
                        if (wandbox.lower.languages.includes(lang)) await run({
                            message: message,
                            content: content,
                            cmd: 'compile'
                        });
                    }
                }
            }
        } catch (error) {
            debug(error);
        }
    });
}
