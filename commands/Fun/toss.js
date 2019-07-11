module.exports = async ({message, content}) => await response.create({
    message: message,
    title: 'Tossed a coin',
    fields: {
        Result: misc.random.element(['Heads', 'Tails'])
    }
});
