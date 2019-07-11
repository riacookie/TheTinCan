module.exports = async ({ message, edit, command, options }) => {
    if (!Number(options.page)) options.page = 1;
    let pages = misc.number.rows(15, wandbox.normal.languages_default.length);
    let r = await response.create({
        message: message,
        command: command,
        edit: edit,
        title: 'Available languages for compilation',
        fields: await misc.array.page(options.page, 15, wandbox.normal.languages_default),
        fields_config: {
            seperator: ' . '
        },
        args: options,
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
