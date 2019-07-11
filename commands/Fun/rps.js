module.exports = async ({message, content}) => {
    let cfg = {
        'random': misc.random.element(['r', 'p', 's']),
        'r': 'rock',
        'p': 'paper',
        's': 'scissors'
    };
    let _c = misc.string.nthWord(content, 2).toLowerCase();
    let choice = '';
    for (i in cfg) {
        if (_c.startsWith(i)) choice = cfg[i];
    }
    if (!choice) return await response.create({
        message: message,
        error: 'Invalid choice, valid choices are : `random, rock, paper, scissors` (also allowed to just use `r`/`p`/`s`)'
    });
    let bot_choice = cfg[misc.random.element(['r', 'p', 's'])];
    
    let result = (bot_choice == 'rock' && choice == 'paper') ||
        (bot_choice == 'paper' && choice == 'scissors') ||
        (bot_choice == 'scissors' && choice == 'rock') ?
        'You win, I lose' : bot_choice == choice ? 'It\'s a tie' : 'You lose, I win';
    return await response.create({
        message: message,
        title: 'Rock Paper Scissors',
        fields: {
            'You chose': choice,
            'I chose': bot_choice,
            Result: result
        }
    });
}
