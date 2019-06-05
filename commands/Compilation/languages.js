module.exports = async message => {
    try {
        let page = (await mentions.getNumber(message)).number;
        if (!page) page = 1;
        if (!(page < 1 || page > Math.ceil(wandbox.languages.normal.length/15))) {
            let fields = response.fetchPage({
                rawPages: wandbox.languages.normal,
                limit: 15,
                page: page
            });
            return await response.send(response.create({
                author: message.author,
                message: message,
                title: 'Supported languages',
                fields: fields.items,
                seperator: '.',
                footer: {
                    icon_url: Client.displayAvatarURL,
                    text: `Page ${fields.page}/${fields.pages}`
                }
            }));
        }
        else {
            return await response.error({
                message: message,
                error: 'Invalid page'
            });
        }
    } catch (error) {
        debug(error)
    }
}
