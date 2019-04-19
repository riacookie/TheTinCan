exports.run = async(message) => {
    try {
        let data = await resolve.getNumber(message);
        let page = data.numbers.length != 0 ? data.numbers[0] : 1;
        let list = {};
        let length = wandbox.languages.normal.length;
        if (page < 1 || page > Math.ceil(length/15)) {
            response.error(message, "Invalid Page");
            return;
        }
        let j = 1;
        for (let i = (page-1)*15; i < wandbox.languages.normal.length; i++) {
            const lang = wandbox.languages.normal[i];
            list[(i+1).toString()] = lang;
            j++;
            if (j > 15) break;
        }
        response.send(message,
            response.create({
                "title": "Supported Languages :",
                "author": message.author,
                "mention": true,
                "linebreak": true,
                "seperator": ".",
                "fields": list,
                "footer": {
                    "icon_url": client.user.displayAvatarURL,
                    "text": `Page ${page}/${Math.ceil(length/15)}`
                },
                "error": "SOmething went wrong, languages.js isn't working properly"
            })
        );
    } catch (error) {
        debug(error);
    }
}
