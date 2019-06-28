module.exports = () => new Promise((resolve, reject) => {
    Client.login(process.env.token)

    Client.on('ready', async () => {
        resolve();
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
        if (!message.author.bot && message.content.startsWith(process.env.prefix)) {
            let cmd = firstWord(message.content).toLowerCase().replace(process.env.prefix, '');
            let blacklisted = await management.isBlacklisted(message.author.id);
            if (bot.commands.cmds[cmd] && (bot.commands.cmds[cmd] == 'identity' || !blacklisted)) {
                try {
                    await require(`../commands/${bot.commands.files[bot.commands.cmds[cmd]]}`)(message);
                } catch (error) {
                    debug(error);
                }
            }
            else if (!blacklisted) {
                let lang = cmd.toLowerCase();
                let i = wandbox.languages.lower.indexOf(lang);
                if (i == -1) {
                     lang += ' ' + firstWord(shiftWord(message.content.toLowerCase()));
                     i = wandbox.languages.lower.indexOf(lang);;
                }
                if (i != -1) {
                    lang = wandbox.languages.normal[i];
                    debug(lang);
                    try {
                        await require(`../commands/${bot.commands.files['compile']}`)(message, lang);
                    } catch (error) {
                        debug(error);
                    }
                }
            }
        }
    })
})
