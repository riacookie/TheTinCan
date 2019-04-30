exports.send = (message, config, callback) => {
    callback = config.callback ? config.callback : callback ? callback : ((msg, err) => {});
    let err = error => {
        debug(error);
        response.error(message, config.error);
        callback(_, error);
    }
    try {
        let reply = (...stuffs) => {
            if (config.edit) {
                config.edit.edit(...stuffs).then(callback).catch(err);
            }
            else if (config.mention || !message.guild) {
                message.reply(...stuffs).then(callback).catch(err);
            }
            else {
                message.channel.send(...stuffs).then(callback).catch(err);
            }
        }
        if (message.guild) {
            let f1 = message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS");
            if (config.file) {
                let f2 = message.channel.permissionsFor(message.guild.me).has("ATTACH_FILES");
                (f1 && f2 && config.embed) ? reply(config.embed) : ((f2 && config.file) ? reply(...config.file) : reply(config.text));
            }
            else {
                (f1 && config.embed) ? reply(config.embed) : reply(config.text);
            }
        }
        else {
            config.embed ? reply(config.embed) : (config.file ? reply(...config.file) : reply(config.text));
        }
    } catch (error) {
       err(error);
    }
}

exports.error = (message, text) => {
    try {
        message.reply(`**Error :** ${text}`);
    } catch (error) {
        debug(error);
    }
}

exports.create = (config) => {
    let result = {};
    if (config.file) {
        result = {
            "embed": {
                "embed": {
                    "color": config.color || 0x000000,
                    "title": config.title,
                    "author": {
                        "name": config.author.tag,
                        "icon_url": config.author.displayAvatarURL
                    },
                    "image": {
                        "url": `attachment://${config.filename}`
                    },
                    "timestamp": new Date()
                },
                "files": [{
                    "attachment": config.file,
                    "name": config.filename
                }]
            },
            "text": config.title + " :\r\n" + config.fileurl,
            "file": [config.title, {
                "files": [{
                    "attachment": config.file,
                    "name": config.filename
                }]
            }],
            "mention": config.mention,
            "edit": config.edit,
            "callback": config.callback,
            "error": config.error
        };
    }
    else {
        result = {
            "embed": {
                "embed": {
                    "color": config.color || 0x000000,
                    "title": config.title,
                    "author": {
                        "name": config.author.tag,
                        "icon_url": config.author.displayAvatarURL
                    },
                    "timestamp": new Date(),
                    "description": ""
                }
            },
            "text": config.title + " :\r\n",
            "mention": config.mention,
            "edit": config.edit,
            "callback": config.callback,
            "error": config.error
        };
    }
    if (config.description) {
        result.embed.embed.description = config.description;
    }
    if (config.fields) {
        if (config.fields instanceof Array) {
            for (let i = 0; i < config.fields.length; i++) {
                const field = config.fields[i];
                let text = `:black_small_square: ${field}`
                text.endsWith(".") || text.endsWith("```") ? _ : text += ".";
                if (i != 0 && config.linebreak) text = "\r\n" + text;
                result.text += text;
                result.embed.embed.description += text;
            }
        }
        else {
            let keys = Object.keys(config.fields);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = config.fields[key] instanceof Array ? config.fields[key].join(", ") : config.fields[key];
                let text = `:black_small_square: **${key} ${config.seperator || ":"}** ${value}`;
                text.endsWith(".") || text.endsWith("```") ? _ : text += ".";
                if (i != 0 && config.linebreak) text = "\r\n" + text;
                result.text += text;
                result.embed.embed.description += text;
            }
        }
    } 
    if (config.footer)  {
        result.embed.embed.footer = config.footer;
    }
    if (config.thumbnail) {
        result.embed.embed.thumbnail = {
            "url": config.thumbnail
        };
    }
    debug(result);
    return result;
}

