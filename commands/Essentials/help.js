bot_data.categories = {};
for (const cmd of bot_data.commands) {
    const command = bot_data.commands[cmd];
    if (!bot_data.categories[command.category]) bot_data.categories[command.category] = {};
    bot_data.categories[command.category][cmd] = command.about;
}

module.exports = async ({message, content, used_command, command, options}) => {
    let arg = misc.string.shiftWord(content).toLowerCase();
    let defaults = {
        message: message,
        footer: [`Prefix : ${prefix}`, `Options prefix : ${process.env.options_prefix}`],
        fields_config: {
            joinArr: true,
            parseVariables: true
        }
    }
    if (!options.list && !options.command && !options.topic) {
        options.list =  ['cmds', 'commands'].includes(used_command.toLowerCase()) || arg == 'commands' ? 'commands' : _;
    }
    if (!options.list && !options.command && !options.topic && arg) {
        if (commands.names[arg]) options.command = commands.names[arg];
        else if (bot_data.topics[arg]) options.topic = arg;
        else if (bot_data.categories[arg]) options.category = arg;
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
                Aliases: cmd.aliases.length ? cmd.aliases.join(', ') : 'None',
                About: cmd.about,
                Syntax: cmd.syntax,
                Examples: cmd.examples
            },
            ...defaults,
            fields_config: {
                Examples: {
                    parseVariables: true
                },
                parseVariables: true
            }
        });
    }
    else if (options.topic) return await response.create({
        title: `Topics/${options.topic}`,
        fields: bot_data.topics[options.topic],
        ...defaults,
        fields_config: {
            joinArr: true,
            defaultKeys: true,
            parseVariables: true
        }
    });
    else if (options.category)  return await response.create({
        title: `Commands/${options.category}`,
        fields: bot_data.categories[options.category],
        ...defaults
    });
    else return await response.create({
        error: 'Invalid arguments',
        ...defaults
    });
}
