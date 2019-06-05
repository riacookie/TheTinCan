module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
            author: message.author,
            title: 'Tossed a coin',
            fields: {
                Result: randomElement(['Heads', 'Tails'])
            },
            error: 'Coin fell out of hand'
        }));
    } catch(error) {
        debug(error);
    }
}
