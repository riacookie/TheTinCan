module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            author: message.author,
            title: shiftWord(message.content),
            fields: {
                Answer: randomElement(bot.answers)
            },
            error: 'Your question destroyed the universe, wait till we rebuild it.'
        }));
    } catch(error) {
        debug(error);
    }
}
