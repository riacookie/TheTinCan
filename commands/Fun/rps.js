module.exports = async message => {
    try {
        let cfg = {
            'rock': 'rock',
            'paper': 'paper',
            'scissors': 'scissors',
            'random': randomElement(['rock', 'paper', 'scissors']),
            'r': 'rock',
            'p': 'paper',
            's': 'scissors'
        }
        let botChoice = randomElement(['rock', 'paper', 'scissors']);
        let userChoice = cfg[shiftWord(message.content).toLowerCase()];
        if (userChoice) {
            let result = (botChoice == 'rock' && userChoice == 'paper')
                || (botChoice == 'paper' && userChoice == 'scissors')
                || (botChoice == 'scissors' && userChoice == 'rock')
                    ? 'You win, I loose' : botChoice == userChoice ? 'It\'s a tie' : 'You loose, I win';
            return await response.send(response.create({
                message: message,
                author: message.author,
                title: 'Rock Paper Scissors',
                fields: {
                    'You chose': userChoice,
                    'I chose': botChoice,
                    'Result': result
                },
                error: 'Your parents interrupted the game'
            }));
        }
        else {
            return await response.error({
                message: message,
                error: 'Invalid choice, valid choices : `rock, paper, scissors, random, r, p, s`'
            });
        }
    } catch(error) {
        debug(error);
    }
}
