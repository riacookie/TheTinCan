module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            author: message.author,
            title: 'TheTinCan\'s github repository',
            description: ':black_small_square: ' + bot.github,
            error: 'Failed to fetch information'
        }));
    } catch(error) {
        debug(error);
    }
}
