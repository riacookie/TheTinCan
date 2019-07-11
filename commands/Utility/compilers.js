module.exports = async ({ message, content, edit, command, options }) => {
    if (!Number(options.page)) options.page = 1;
    let lang = await mentions.getLanguage(content);
    if (!lang) return await response.create({
        message: message,
        error: 'Invalid language'
    });
    let arr = wandbox.normal.compilers[lang];
    if (arr.length > 15) {
        let pages = misc.number.rows(15, arr.length);
        let r = await response.create({
            message: message,
            edit: edit,
            title: `Available compilers for ${lang}`,
            fields: await misc.array.page(options.page, 15, arr),
            fields_config: {
                seperator: ' . '
            },
            footer: `Page ${options.page}/${pages}`
        });
        input.pageInteraction({
            command: command,
            message: r[0],
            cmd_message: message,
            current: options.page,
            min: 1,
            max: pages,
            callback: (p, c) => {
                if (c == 'timeout') return;
                run({
                    message: message,
                    cmd: command,
                    edit: r[0],
                    options: {page: p}
                });
            }
        });
        return r;
    }
    else return await response.create({
        message: message,
        title: `Available compilers for ${lang}`,
        fields: arr
    });
}
