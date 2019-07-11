module.exports = async ({message, content}) => {
    const id = await management.identity.get(message.author.id);
    if (id < 2) return await response.custom({
        message: message,
        error: 'You don\'t have permission to use this command'
    });
    global['bot_data'] = await firebase.get('/bot');
    debug(`refreshed database cache.`);
    return await response.custom({
        message: message,
        fields: 'Successfully refreshed database ceche'
    });
}
