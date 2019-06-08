module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            author: message.author,
            title: 'Your answer is',
            fields: {
                Result: randomElement(bot.answers)
            },
            error: 'Your question destroyed the universe, wait till we rebuild it.'
        }));
    } catch(error) {
        debug(error);
    }
}
