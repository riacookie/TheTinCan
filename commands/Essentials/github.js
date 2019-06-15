module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            title: 'TheTinCan\'s github repository',
            fields: [bot.github],
            noKey: true,
            error: 'Failed to fetch information'
        }));
    } catch(error) {
        debug(error);
    }
}
