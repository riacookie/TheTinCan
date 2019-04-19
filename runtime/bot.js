client.on("ready", () => {
    debug(`logged in as ${client.user.tag} | ${client.user.id}`);
    firebase.get("/bot/debug", data => {
        if (data) {
            debug(`debug server : ${data.guild} , debug channel ${data.channel}`);
            let embed = response.create(
                { "author": client.user, "title": `Login :`, "description": `**Logged in as ${client.user.id} | ${client.user.tag}**` }
            ).embed;
            client.guilds.get(`${data.guild}`).channels.get(`${data.channel}`).send(embed)
                .then(message => {
                    debug(`sent init message`);
                }).catch(err => {
                    debug(err);
                });
        }
        else {
            debug(`/bot/debug doesn't exist`);
        }
    })
})

client.on("message", message => {
    if (message.content.startsWith(process.env.prefix)) {
        firebase.get("/bot/commands/files", (data, error) => {
            if (error) {
                response.error(message, "failed to fetch command file data from firebase");
                return;
            }
            if (data) {
                let cmd = message.content.replace(new RegExp(process.env.prefix), "").toLowerCase();
                if (cmd.match(/\r\n|\r|\n|\t| /)) {
                    cmd = cmd.slice(0, cmd.match(/\r\n|\r|\n|\t| /).index);
                }
                if (data[cmd]) {
                    require(`../commands/${data[cmd]}`).run(message);
                }
            }
            else {
                response.error(message, "/bot/commands/files doesn't exist in current firebase database");
            }
        }) 
    }
})

client.login(process.env.token);
