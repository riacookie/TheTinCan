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
                title: `Random number between ${numbers[0]}, ${numbers[1]}`,
                fields: [
                    randomInt(numbers[0], numbers[1])
                ],
                noKey: true,
                error: 'Failed to get random number'
            }));
        }
    } catch(error) {
        debug(error);
    }
}
