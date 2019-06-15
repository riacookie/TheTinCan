module.exports.send = async options =>  {
    try {
        let t, msg;
        if (!options.message || !options.message.guild) {
            if (options.embed) t = options.embed;
            else if (options.image) t = options.image
            else t = options.text

            if (!(t instanceof Array)) t = [t];
            if (options.channel) msg = await options.channel.send(...t);
            else if (options.edit) msg = await options.edit.edit(...t);
            else if (options.mention) msg = await options.message.reply(...t);
            else msg = await options.message.channel.send(...t);
        }
        else {
            let hasPermission = permission => options.message.channel.permissionsFor(options.message.guild.me).has(permission)
            if (options.embed && hasPermission('EMBED_LINKS')) {
                if (options.image) {
                    if (hasPermission('ATTACH_FILES')) t = options.embed
                    else t = options.text
                }
                else t = options.embed
            }
            else if (options.image) {
                if (hasPermission('ATTACH_FILES')) t = options.imag
                else t = options.text
            }
            else t = options.text
            if (!(t instanceof Array)) t = [t];
            if (options.channel) msg = await options.channel.send(...t);
            else if (options.edit) msg = await options.edit.edit(...t);
            else if (options.mention) msg = await options.message.reply(...t);
            else msg = await options.message.channel.send(...t);
        }
        try {
            return msg;
        } catch (error) {
            debug(error);
            await this.error(options);
            return
        }
    } catch (error) {
        debug(error);
        await this.error(options);
        return
    }
}

module.exports.error = async options => {
    try {
        let msg;
        if (options.channel) msg = await options.channel.send(options.error);
        else msg = await options.message.reply('**Error : **' + options.error + (options.error.endsWith('.') ? '' : '.'));
        return msg;
    } catch (error) {
        debug(error);
    }
}

module.exports.create = options => {
    let result = {
        embed: {
            embed: {
                author: {
                    name: options.author.tag || options.message.author.tag,
                    icon_url: options.author.displayAvatarURL || options.message.author.displayAvatarURL
                },
                color: options.color || 0x100b42,
                title: `${options.title} :`,
                timestamp: options.timestamp || new Date(),
                description: "",
            }
        },
        text: '**' + options.title + ' :**' + '\n',
        mention: options.mention || false,
        edit: options.edit,
        error: options.error,
        channel: options.channel,
        message: options.message
    }
    if (options.image) {
        result.embed.embed.files = [{
            attachment: options.image.attachment,
            name: options.image.name || 'image.png'
        }];
        result.embed.embed.image = {
            url: `attachment://${options.image.name || 'image.png'}`
        };
        result.text += options.image.url;
        result.image = [
            '**' + options.title + ' :**',
            {files: result.embed.embed.files}
        ];
    }
    if (options.description) {
        result.embed.embed.description += options.description;
        result.text += options.description;
        if (options.image) {
            result.image[0] += options.description;
        }
    }
    else if (options.fields) {
        let keys = Object.keys(options.fields);
        for (let i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = options.fields[key];
            if (options.fields instanceof Array) key = (i + 1).toString();
            if (value instanceof Array) value = value.join(', ');
            value = value.toString();
            if (!(['`', '.', '!', '?'].includes(value.slice(value.length - 1)))) value = value + '.';
            let text;
            if (options.noKey) {
                text = `:black_small_square: ${value}`;
            } else {
                text = `:black_small_square: **${key} ${options.seperator || ':'}** ${value}`;
            }
            if (options.nokey) text = `:black_small_square: ${value}`;
            if (i != 0 && !options.singleline) text = '\n' + text;
            result.text += text;
            result.embed.embed.description += text;
        }
    }
    if (options.footer) {
        result.embed.embed.footer = options.footer;
    }
    if (options.thumbnail) {
        result.embed.embed.thumbnail = {
            url: options.thumbnail
        }
    }
    return result;
}

module.exports.fetchPage = options => {
    let raw, n, items, result;
    if (options.page < 1 || options.page > Math.ceil(options.rawPages.length/options.limit)) {
        return {
            error: 'invalid page'
        }
    }
    else if (options.page == 1 && options.rawPages.length <= options.limit){
        items = options.rawPages;
        n = 0;
    }
    else {
        raw = [...options.rawPages];
        n = (options.page - 1) * options.limit;
        items = raw.splice(n).splice(0, options.limit);
    }
    result = {};
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        result[`${n + i + 1}`] = item;
    }
    return {
        items: result,
        page: options.page,
        pages: Math.ceil(options.rawPages.length/options.limit)
    }
}
