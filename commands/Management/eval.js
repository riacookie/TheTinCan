module.exports = async ({message, content}) => {
    const identity = await management.identity.get(message.author.id);
    if (!identity.permissions.includes('EXECUTE')) return await response.create({
        message: message,
        error: 'You don\'t have permission to use this command'
    });
    return await response.create({
        message: message,
        fields: eval(await mentions.getCode(misc.string.shiftWord(content)))
    });
}
