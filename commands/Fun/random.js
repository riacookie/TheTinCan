module.exports = async message => {
    try {
        let numbers = (await mentions.getNumbers(message)).numbers;
        if (!numbers || numbers.length < 2) {
            return await response.error({
                message: message,
                error: 'You need to specify 2 numbers'
            });
        }
        else {
            return await response.send(response.create({
                message: message,
                author: message.author,
                title: `Random numbet between ${numbers[0]}, ${numbers[1]}`,
                fields: {
                    Result: randomInt(numbers[0], numbers[1])
                },
                error: 'Failed to get random number'
            }));
        }
    } catch(error) {
        debug(error);
    }
}
