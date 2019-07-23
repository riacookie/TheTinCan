module.exports = async ({message, content}) => {
    const identity = await management.identity.get(message.author.id);
    if (!identity.permissions.includes('EXECUTE')) return await response.create({
        message: message,
        error: 'You don\'t have permission to use this command'
    });
    const code = await mentions.getCode(misc.string.shiftWord(content));
    const result = await (() => new Promise(resolve => {
        eval(`(async () => ${code})().then(resolve).catch(err => resolve(err.stack));`);
    }))();
    if (result != undefined) return await response.create({
        message: message,
        fields: result,
        fields_config: {
            default_keys: true
        }
    });
}
