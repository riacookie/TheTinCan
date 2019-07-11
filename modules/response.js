module.exports.parseOptions = o => {
    let options = {...o};
    if (!options.channel && (options.message || options.edit)) {
        options.channel = options.edit ? options.edit.channel : options.message.channel;
    }
    if (!options.author) options.author = options.message.author;
    let hasPermission = () => true;
    if (options.channel.guild) {
        hasPermission = permission => options.channel.permissionsFor(options.channel.guild.me).has(permission);
    }
    options.permissions = {
        EMBED_LINKS: hasPermission('EMBED_LINKS'),
        ATTACH_FILES: hasPermission('ATTACH_FILES')
    };
    if (options.error) {
        if (!options.fields) options.fields = {};
        options.fields.Error = options.error;
    }
    return options;
}

module.exports.parseField = (channelid, field, key = '', config = {}) => {
    if (key) key = misc.formatting.plain(key);
    if (key != '_') {
        return ((key && !config.noKey) ? `**${key}${config.seperator || ' : '}**` : '') + misc.formatting.normal(field, channelid);
    }
    else {
        return '**' + misc.formatting.normal(misc.formatting.plain(field), channelid) + '**';
    }
}

module.exports.parseFields = async (fields = new Error(), start = '', config = {}, channelid, n = 0) => {
    if (fields instanceof Error) {
        return start + characters.square + ' ' + this.parseField(channelid, fields.message, fields.name, config);
    }
    else if (typeof fields == 'string' || typeof fields == 'number' || typeof fields == 'boolean' || [undefined, null].includes(fields)) {
        return start + characters.square + ' ' + this.parseField(channelid, fields, _, config);
    }
    else if (fields instanceof Object) {
        let r = [];
        let keys = Object.keys(fields);
        n++;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const field = fields[key];
            let cfg = config[key] || config;
            let args;
            if (fields instanceof Array) {
                args = {
                    ...cfg,
                    seperator: ' . '
                };
            }
            if (args) args.key = (i + 1).toString();
            if (typeof field == 'string' || typeof field == 'number' || typeof field == 'boolean' || [undefined, null].includes(field)) {
                r.push(start + characters.square + ' ' + this.parseField(channelid, field, args ? args.key : key, args || cfg));
            }
            else {
                let _start = misc.formatting.zwspWrap(' '.repeat(n * 4));
                let _v = '';
                if (field instanceof Array) _v = ` (${field.length})`;
                
                let s = start + characters.square + this.parseField(channelid, '', (args ? args.key : key) + _v, args || config);
                if (cfg.title) s += misc.formatting.normal(cfg.title, channelid);
                if (cfg.joinArr && field instanceof Array) {
                    s += misc.formatting.normal(field.join(', '), channelid);
                }
                else {
                    s += '\n';
                    s += await this.parseFields(field, _start, cfg, channelid, n);
                }
                r.push(s);
            }
        }
        return r.join('\n');
    }
}

module.exports.create = async options => {
    options = this.parseOptions(options);
    let messages = [];
    let data = [];
    let results = [];
    if (options.description) data.push(options.description);
    if (options.fields) data.push(await this.parseFields(options.fields, '', options.fields_config, options.channel.id));
    if (options.permissions.EMBED_LINKS) {
        let r = {
            embed: {
                author: {
                    name: options.author.tag,
                    icon_url: options.author.displayAvatarURL
                },
                color: options.color || 0x100b42,
                timestamp: options.timestamp || new Date(),
                description: data.join('\n'),
            }
        };
        if (options.title) r.embed.title = `${options.title} :`;
        if (options.footer) {
            r.embed.footer = {
                icon_url: options.footer_icon || client.displayAvatarURL,
                text: options.footer instanceof Array ? options.footer.join(' ' + characters.circle + ' ') : options.footer
            };
        }
        if (options.thumbnail) {
            r.embed.thumbnail = {
                url: options.thumbnail
            };
        }
        if (options.image) {
            if (options.permissions.ATTACH_FILES) {
                r.embed.files = [{
                    attachment: options.image.url,
                    name: options.image.name || 'image.png'
                }];
                r.embed.image = {
                    url: `attachment://${options.image.name || 'image.png'}`
                };
            }
            else {
                r.embed.description += '\n' + options.image.url;
            }
        }
        results.push(r);
    }
    else {
        let r = '';
        if (options.title) r +=`**${options.title} :**\n`;
        r += data.join('\n');
        if (options.image) r += '\n' + options.image.url;
    }
    if (options.files && options.permissions.ATTACH_FILES) {
        results.push({
            files: options.files
        });
    }
    for (let result of results) {
        let msg = options.edit ? await options.edit.edit(result) : await options.channel.send(result);
        messages.push(msg);
    }
    return messages;
}
