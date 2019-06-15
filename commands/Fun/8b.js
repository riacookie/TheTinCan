module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            title: 'Some random answer',
            fields: [
                randomElement(bot.answers)
            ],
            noKey: true,
            error: 'Your question destroyed the universe, wait till we rebuild it.'
        }));
    } catch(error) {
        debug(error);
    }
}
