global['commands'] = {
    functions: {},
    names: {},
    categories: {}
};

for (let folder of fs.readdirSync('./commands')) {
    for (let file of fs.readdirSync(`./commands/${folder}`)) {
        global['commands'].functions[file.slice(0, file.lastIndexOf('.'))] = require(`../commands/${folder}/${file}`);
    }
}

debug(`initialized command files.`);

bot_data.categories = {};
for (command in bot_data.commands) {
    global['commands'].names[command] = command;
    if (bot_data.commands[command].aliases) {
        for (cmd of bot_data.commands[command].aliases) {
            global['commands'].names[cmd] = command
        };
    }
    if (!commands.categories[bot_data.commands[command].category]) {
        commands.categories[bot_data.commands[command].category] = [];
        bot_data.categories[bot_data.commands[command].category.toLowerCase()] = {};
    }
    commands.categories[bot_data.commands[command].category].push(command)
    bot_data.categories[bot_data.commands[command].category.toLowerCase()][command] = bot_data.commands[command].about;
}

async function parseOptions(str, keys = []) {
    let options = {};
    let arr = str.split(/ +; +| +, +| +;| +,|; +|, +|;|,| +-- +| +--|-- +|--| +- +| +-|- +|-/);
    let flag = str.includes(':') || str.includes('=') || str.includes('-');
    if (!flag) {
        if (keys.length == 0) options = [];
        for (let i = 0; i < arr.length; i++) {
            let option = misc.normalizeType(arr[i].trim());
            if (keys[i]) options[keys[i]] = option;
            else options[i] = option;
        }
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            const option = arr[i].trim();
            if (option) {
                const m = option.match(/ +: +| +:|: +|:| += +| +=|= +|=| +/);
                if (m) {
                    let v = misc.normalizeType(option.slice(m.index + m[0].length).trim());
                    if (v == '') v = true;
                    options[option.slice(0, m.index).trim()] = v;
                }
                else {
                    options[i] = misc.normalizeType(option);
                }
            }
        }
    }
    return options;
}

async function parseArguments(args) {
    let result = {...args};
    if (!result.content) result.content = result.message.content.replace(prefix, '');
    if (!result.command) result.command = commands.names[result.cmd];
    if (!result.options) {
        result.options = {};
        let i = result.content.lastIndexOf(process.env.options_prefix)
        if (i != -1) {
            let str = result.content.slice(i + process.env.options_prefix.length).trim();
            result.content = result.content.slice(0, i).trim();
            result.options =  await parseOptions(str);
        }
        else if (
            !bot_data.commands[result.command].input &&
            misc.string.wordAmount(result.content) > 1 &&
            bot_data.commands[result.command].options
        ) {
            result.options = await parseOptions(
                misc.string.shiftWord(result.content),
                bot_data.commands[result.command].default_options
            );
            result.content = misc.string.firstWord(result.content);
        }
    }
    return result;
}

module.exports = async(args) => {
    let {message, edit, content, cmd, command, options} = await parseArguments(args);
    try {
        return await commands.functions[command]({
            message: message,
            edit: edit,
            content: content,
            command: command,
            used_command: cmd,
            options: options
        });
    } catch (error) {
        debug(error);
        return await response.create({
            message: message,
            title: `Received error in execution of ${commands.names[cmd]} command`,
            fields: error
        }).catch(debug);
    }
}
