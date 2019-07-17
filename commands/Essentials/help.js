module.exports = async ({message, content, used_command, command, options}) => {
    let arg = misc.string.shiftWord(content).toLowerCase();
    let defaults = {
        message: message,
        footer: [`Prefix : ${prefix}`, `Options prefix : ${process.env.options_prefix}`],
        fields_config: {
            joinArr: true
        }
    }
    if (!options.list && !options.command && !options.topic) {
        options.list =  ['cmds', 'commands'].includes(used_command.toLowerCase()) || arg == 'commands' ? 'commands' : _;
    }
    if (!options.list && !options.command && !options.topic && arg) {
        if (commands.names[arg]) options.command = commands.names[arg];
        else if (bot_data.topics[arg]) options.topic = arg;
    }
    if (!options.list && !options.command && !options.topic) {
        let topics = {};
        for (let t in bot_data.topics) {
            topics[t] = `Type \`${prefix}help ${t}\` to see a list of ${bot_data.topics[t]._}`;
        }
        return await response.create({
            ...defaults,
            title: 'Information about bot\'s usage',
            fields: {
                Commands: `Type \`${prefix}help commands\` to see a list of commands`,
                ...topics
            },
            fields_config: {
                joinArr: true
            }
        });
    }
    else if (options.list) {
        if (options.list == 'commands') return await response.create({
            title: 'List of available commands',
            fields: commands.categories,
            ...defaults
        });
        else if (options.list == 'types') return await response.create({
            title: 'List of available commands',
            fields: bot_data.topics.types,
            ...defaults
        });
    }
    else if (options.command) {
        let cmd = bot_data.commands[options.command];
        return await response.create({
            title: `Commands/${cmd.category}/${options.command}`,
            fields: {
                Category: cmd.category,
                About: cmd.about,
                Syntax: cmd.syntax,
                Examples: cmd.examples
            },
            ...defaults,
            fields_config: {
                Examples: {
                    joinArr: false
                }
            }
        });
    }
    else if (options.topic) return await response.create({
        title: `Topics/${options.topic}`,
        fields: bot_data.topics[options.topic],
        ...defaults,
        fields_config: {
            joinArr: true,
            defaultKeys: true
        }
    });
    else return await response.create({
        error: 'Invalid arguments',
        ...defaults
    })
}
