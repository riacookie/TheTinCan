module.exports = async({message, command, content}) => {
    let msg, cmd, flag;
    let _content = misc.string.shiftWord(content); 
    if (_content) cmd = misc.string.firstWord(_content).toLowerCase();
    if (commands.names[cmd]) {
        msg = misc.array.last(await run({
            message: message,
            content: _content,
            cmd: cmd
        }));
        flag = true;
    }
    else {
        msg = await message.reply('Ping?');
    }
    if (!msg) return await response.create({
        message: message,
        error: 'Specified command didn\'t return response',
        footer: `No response from specified command ${cmd}`
    });
    return await response.create({
        message: message,
        edit: flag ? _ : msg,
        title: 'Pong!',
        fields: {
            'Reply Speed': `${msg.createdTimestamp - message.createdTimestamp}ms`,
            'Connection Speed': `${Math.round(client.ping)}ms`
        }
    });
}
