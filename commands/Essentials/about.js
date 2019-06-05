module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            author: message.author,
            title: 'Information about Project TheTinCan',
            fields: bot.info,
            error: 'Failed to fetch information'
        }));
    } catch(error) {
        debug(error);
    }
}
