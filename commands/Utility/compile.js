module.exports = async ({ message, content, command, used_command, options }) => {
    let data = await mentions.getCompiler(
        misc.string.firstWord(content).toLowerCase() == used_command ? misc.string.shiftWord(content) : content
    )
    if (!data) return await response.create({
        message: message,
        cmd: command,
        error: 'Invalid language/compiler name'
    });
    let code = misc.string.shiftWord(content);
    if (!data.language_mention) {
        code = misc.string.shiftWords(code, misc.string.wordAmount(data.compiler));
    }
    else {
        let c = data.language.toLowerCase();
        while (c && code && misc.string.firstWord(code).toLowerCase() == misc.string.firstWord(c)) {
            code = misc.string.shiftWord(code);
            c = misc.string.shiftWord(c);
        }
    }
    code = await mentions.getCode(code);
    if (!code) return await response.create({
        message: message,
        cmd: command,
        error: 'Code not provided'
    });
    let [res, body] = await wandbox.compile({
        code: code,
        compiler: data.compiler,
        stdin: options.stdin || options.i || options.input || options.in
    });
    let result = {
        message: message,
        cmd: command,
        title: 'Compilation result',
        fields: {}
    };
    if (!body) result.fields.Error = misc.string.formatting.codeBlock('Program timed out.', 'fix');
    else {
        if (body.program_output) {
            result.fields.Output = misc.formatting.codeBlockLimited(body.program_output, '', {lines: 15, characters: 1000}, 'output');
        }
        if (body.program_error) {
            result.fields.Error = misc.formatting.codeBlockLimited(body.program_error, 'fix', {lines: 15, char: 1000}, 'error');
        }
        if (body.compiler_error) {
            result.fields['Compiler error'] = misc.formatting.codeBlockLimited(body.compiler_error, 'fix', {lines: 15, char: 1000}, 'error');
        }
        if (body.status) {
            result.fields['Exit code'] = body.status;
        }
    }
    result.fields.Compiler = data.compiler;
    return await response.create(result);
}
