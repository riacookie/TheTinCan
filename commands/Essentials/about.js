module.exports = async ({message}) => await response.create({
    message: message,
    title: 'My Information',
    fields: JSON.parse(bot_data.info),
    thumbnail: client.user.displayAvatarURL
});
