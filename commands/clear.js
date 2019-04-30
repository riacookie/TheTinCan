exports.run = async(message) => {
    try {
        if (message.guild) {
            resolve.getUser(message).then(async(result) => {
                if (result.guild) {
                    let [allowed, users, mentioned, amount] = [false, result.users.map(u => u.id), true, (await resolve.getNumber(message)).numbers[0] || 0];
                    if (amount < 1) {
                        response.error(message, "Invalid amount");
                        return;
                    }
                    if (amount > 1000) {
                        response.error(message, "Max limit is 1k");
                        return;
                    }
                    if (result.exitcode < 0) mentioned = false;
                    if (mentioned && result.users.length == 1 && users[0] == message.author.id) allowed = true;
                    if ((!allowed) && (message.channel.permissionsFor(await message.guild.fetchMember(message.author.id)).has('MANAGE_MESSAGES'))) allowed = true;
                    if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
                        if (users.length != 1 || users[0] != client.user.id) {
                            response.error(message, "I don't have permission to delete those messages");
                            return;
                        }
                    }
                    async function del() {
                        let r = 0;
                        if (!mentioned) {
                            amount++;
                            let n = amount;
                            while (n > 100) {
                                let messages = await message.channel.bulkDelete(100, true);
                                n -= 100;
                                r += messages.size;
                            }
                            if (n > 0) {
                                let messages = await message.channel.bulkDelete(n, true);
                                n -= 100;
                                r += messages.size;
                            }
                            r--;
                        }
                        else {
                            let n = 1000;
                            while (r < amount && n > 0) {
                                n -= 100;
                                let messages = (await message.channel.fetchMessages({'limit': 100})).array();
                                for (let i = 0; i < messages.length; i++) {
                                    const msg = messages[i];
                                    if (users.indexOf(msg.author.id) != -1 && msg.deletable && !msg.deleted) {
                                        if (!(r < amount && n > 0)) break;
                                        if (msg.id != message.id) {
                                            r++;
                                        }
                                        await msg.delete();
                                    }
                                }
                            }
                        }
                        return r;
                    }
                    
                    async function end() {
                        let config = {
                            "author": message.author,
                            "mention": true,
                            "fields": [],
                            "title": "Cleared :",
                            "error": "Something went wrong, clear.js isn't working properly"
                        };
                        del().then((r) => {
                            if (!mentioned) {
                                config.fields.push(`${r} message(s)`);
                            }
                            else {
                                config.fields.push(`${r} message(s) that were sent by ${result.users.map(u => `<@${u.id}>`).join(', ')}`);
                            }
                            response.send(message, response.create(config));
                        }).catch((err) => {
                            debug(err);
                        });
                    }
                    if (allowed) {
                        end();
                    }
                    else {
                        identity.server.get(message.guild.id, message.author.id, (id, err) => {
                            debug(err);
                            if (id) {
                                if (id.id > 0) {
                                    allowed = true;
                                    end();
                                }
                                else {
                                    identity.bot.get(message.author.id, (id, err) => {
                                        debug(err);
                                        if (id) {
                                            if (id.id > 3) {
                                                allowed = true;
                                                end();
                                            }
                                            else {
                                                response.error(message, "You don't have permission to delete those messages");
                                            }
                                        }
                                        else {
                                            response.error(message, "You don't have permission to delete those messages");
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
                else {
                    response.error(message, "You can only specify members who are currently in this guild");
                }
            }).catch((err) => {
                debug(err);
            });
        }
        else {
            response.error(message, "This command can only be used in guilds");
        }
    } catch (error) {
        debug(error)
    }
}
