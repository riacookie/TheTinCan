module.exports = async message => {
    try {
        let die = (await mentions.getNumber(message)).number || 2;
        if (die > 10) die = 10;
        let result = [];
        for (let i = 1; i <= die; i++) {
            result.push(randomInt(1, 6));
        }
        return await response.send(response.create({
            message: message,
            title: `Rolled some(${die}) die`,
            fields: {
                Rolls: result.join(', ')
            },
            error: 'Coin fell out of hand'
        }));
    } catch(error) {
        debug(error);
    }
}
