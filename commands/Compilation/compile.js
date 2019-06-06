module.exports = async message => {
    try {
        let [compiler, lang] = await mentions.getCompiler(message);
        if (!compiler){
            return await response.error({
                message: message,
                error: 'Invalid language/compiler name'
            });
        }
        else {
            let code = await mentions.getCode(message, lang || compiler);
            if (!code) {
                return await response.error({
                    message: message,
                    error: 'No code specified'
                });
            }
            else {
                let result = await wandbox.compile({
                    code: code,
                    compiler: compiler
                }, 10000);
                let res, body;
                if (result) [res, body] = result;
                let fields = {};
                let codeBlock = (text, lang, limit, name) => {
                    text = text.replace(/```/gi, "`​`​`");
                    if (limit && (text.split(/\r\n|\r|\n/g) > limit.lines || text.length > limit.char)) {
                        let t = text.slice(0, limit.char);
                        while (t.split(/\r\n|\r|\n/g).length > limit.lines) {
                            t = t.slice(0, t.lastIndexOf('\n'));
                        }
                        return `\`\`\`${lang}\n${t}\`\`\`${name || 'result'} too large.\nmax line limit : ${limit.lines}.\nmax character limit : ${limit.char}.`
                    }
                    else {
                        return `\`\`\`${lang}\n${text}\`\`\``;
                    }
                }
                if (!body) {
                    fields.Error = codeBlock('Program timed out.', 'fix');
                }
                else {
                    if (body.program_output) {
                        fields.Output = codeBlock(body.program_output, '', {lines: 20, char: 1000}, 'output');
                    }
                    if (body.program_error) {
                        fields.Error = codeBlock(body.program_error, 'fix', {lines: 20, char: 1000}, 'output');
                    }
                    if (body.compiler_error) {
                        fields['Compiler error'] = codeBlock(body.compiler_error, 'fix', {lines: 20, char: 1000}, 'output');
                    }
                    if (body.status) {
                        fields['Exit code'] = body.status;
                    }
                }
                fields.Compiler = compiler;
                return await response.send(response.create({
                    author: message.author,
                    message: message,
                    title: 'Compiler result',
                    fields: fields,
                    error: 'Something went wrong, failed to fetch compiler result.'
                }));
            }
        }
    } catch (error) {
        debug(error);
    }
}
