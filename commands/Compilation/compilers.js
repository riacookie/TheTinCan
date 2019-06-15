module.exports = async message => {
    try {
        let page = (await mentions.getNumber(message)).number;
        if (!page) page = 1;
        let language = await mentions.getLanguage(message);
        if (!language) {
            return await response.error({
                message: message,
                error: 'Invalid language'
            });
            return;
        }
        else if (!(page < 1 || page > Math.ceil(wandbox.compilers.normal[language].length/15))) {
            let fields = response.fetchPage({
                rawPages: wandbox.compilers.normal[language],
                limit: 15,
                page: page
            });
            return await response.send(response.create({
                message: message,
                title: `Available compilers for ${language}`,
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
