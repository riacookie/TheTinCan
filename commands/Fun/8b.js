module.exports = async ({message, content}) => await response.create({
    message: message,
    fields: misc.random.element(bot_data.answers)
});
