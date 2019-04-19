exports.run = async(message) => {
    try {
        if (message.content.indexOf(" ") != -1) {
            let data = await resolve.getNumber(message);
            let page = data.numbers[0] || 1;
            let lang = message.content.replace(new RegExp(message.content.slice(0, message.content.indexOf(" ")) + " "), "");
            if (data.numbers[0]) {
                lang = lang.replace(new RegExp(" " + data.numbers[0]), "");
                lang = lang.replace(new RegExp(data.numbers[0] + " "), "");
            }
            let n = wandbox.languages.lower.indexOf(lang.toLowerCase());
            if (n == -1) {
                response.error(message, "invalid language");
                return;
            }
            let list = {};
            let length = wandbox.compilers.normal[wandbox.languages.normal[n]].length;
            if (page < 1 || page > Math.ceil(length/15)) {
                response.error(message, "Invalid Page");
                return;
            }
            let j = 1;
            for (let i = (page-1)*15; i < wandbox.compilers.normal[wandbox.languages.normal[n]].length; i++) {
                const cmplr = wandbox.compilers.normal[wandbox.languages.normal[n]][i];
                list[(i+1).toString()] = cmplr;
                j++;
                if (j > 15) break;
            }
            response.send(message,
                response.create({
                    "title": `Compilers for ${wandbox.languages.normal[n]} : `,
                    "author": message.author,
                    "mention": true,
                    "linebreak": true,
                    "seperator": ".",
                    "fields": list,
                    "footer": {
                        "icon_url": client.user.displayAvatarURL,
                        "text": `Page ${page}/${Math.ceil(length/15)}`
                    },
                    "error": "Something went wrong, compilers.js isn't working properly"
                })
            );
        }
        else {
            response.error(message, "no arguments provided");
        }
    
    } catch (error) {
        debug(error);
    }
}
