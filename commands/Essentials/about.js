module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            title: 'Information about Project TheTinCan',
            fields: JSON.parse(bot.info),
            error: 'Failed to fetch information'
        }));
    } catch(error) {
        debug(error);
    }
}
