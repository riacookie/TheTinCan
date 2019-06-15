module.exports = async message => {
    try {
        return await response.send(response.create({
            message: message,
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
