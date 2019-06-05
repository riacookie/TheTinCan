Client.login(process.env.token)

Client.on('ready', async () => {
    debug(`logged in as ${Client.user.tag} | ${Client.user.id}`);
    debug(`prefix : ${prefix}`);
    try {
        let m = await response.send(response.create({
            author: Client.user,
            title: 'Login',
            description: `Logged in as ${Client.user.tag} (${Client.user.id})`,
            error: `response.js:send() returned error`,
            channel: Client.guilds.get(bot.debug.guild).channels.get(bot.debug.channel)
        }));
        if (m) debug(`sent init message`);
    } catch (error) {
        debug(`Promise response.js:send() was rejected`);
    }
})

Client.on('message', async message => {
    if (message.content.startsWith(process.env.prefix)) {
        let cmd = firstWord(message.content).toLowerCase().replace(process.env.prefix, '');
        if (bot.commands.cmds[cmd]) {
            try {
                await require(`../commands/${bot.commands.files[bot.commands.cmds[cmd]]}`)(message);
            } catch (error) {
                debug(error);
            }
        }
        else if (cmd == 'eval' && message.author.id == '469466888657829889') {
            let code = await mentions.getCode(message);
            if (code) {
                try {
                    debug('code : ', code);
                    eval(code);
                } catch (error) {
                    response.error({
                        error: error.toString(),
                        message: message
                    });
                }
            }
        }
        else {
            debug(`invalid command : ${cmd}`);
        }
    }
})

// Client.on('debug', debug);
