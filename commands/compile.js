exports.run = (message) => {
    try {
        if (message.content.indexOf(" ") != -1) {
            let m;
            let cmplr;
            let code;
            if (message.content.includes("```")) {
                message.content = message.content.replace(/\r\n```|\r```|\n```|\t```/gi, " ```");
                m = message.content.match(new RegExp(`${process.env.prefix}([^\`\`\`]+)`))[1];
                m = m.replace(m.slice(0, m.indexOf(" ") + 1), "");
                if (m.endsWith(" ")) {
                    m = m.slice(0, m.length - 1)
                }
                let n = wandbox.languages.lower.indexOf(m.toLowerCase());
                if (n != -1) {
                    cmplr = wandbox.compilers.normal[wandbox.languages.normal[n]][0];
                    if (cmplr.includes('head') && wandbox.compilers.normal[wandbox.languages.normal[n]][1]) {
                        cmplr = wandbox.compilers.normal[wandbox.languages.normal[n]][1];
                    }
                }
                else {
                    n = wandbox.compilers_arr.lower.indexOf(m.toLowerCase());
                    if (n != -1) {
                        cmplr = wandbox.compilers_arr.normal[n];
                    }
                    else {
                        response.error(message, "invalid language/compiler name");
                        return;
                    }
                }
                code = message.content.replace(/\r\n```.*\r\n|\t```.*\t|\r```.*\r|\n```.*\n|```.*\t|```.*\r\n|```.*\n|```.*\r/gi, "```");
                code = code.match(/```([^```]+)/)[1];
            }
            else {
                let _m = message.content.slice(0, message.content.indexOf(" ") + 1);
                let __m = message.content.replace(_m, '');
                if (__m.match(/\r\n|\r|\n|\t| /)) {
                    _m = __m.slice(0, __m.match(/\r\n|\r|\n|\t| /).index + 1);
                }
                __m = __m.replace(_m, '');
                if (__m.indexOf(" ") != -1) {
                    let t = _m + __m.slice(0, __m.indexOf(" ") + 1);
                    if (!t.match(/\r\n|\r|\n|\t/)) {
                        _m = t;
                    }
                }
                if (_m.match(/\r\n|\r|\n|\t/)) {
                    _m = _m.split(/\r\n|\r|\n|\t/)[0];
                }
                if (_m.startsWith(" ")) {
                    _m = _m.slice(1, _m.length);
                }
                if (_m.endsWith(" ")) {
                    _m = _m.slice(0, _m.length - 1);
                }
                if (_m) {
                    let arr = _m.split(" ");
                    m = arr[0];
                    let n = wandbox.languages.lower.indexOf(m.toLowerCase());
                    if (n == -1) {
                        m = _m;
                        n = wandbox.languages.lower.indexOf(m.toLowerCase())
                    }
                    if (n != -1) {
                        cmplr = wandbox.compilers.normal[wandbox.languages.normal[n]][0];
                        if (cmplr.includes('head') && wandbox.compilers.normal[wandbox.languages.normal[n]][1]) {
                            cmplr = wandbox.compilers.normal[wandbox.languages.normal[n]][1];
                        }
                        if (cmplr.includes('head') && wandbox.compilers.normal[wandbox.languages.normal[n]][2]) {
                            cmplr = wandbox.compilers.normal[wandbox.languages.normal[n]][2];
                        }
                    }
                    else {
                        m = arr[0];
                        n = wandbox.compilers_arr.lower.indexOf(m.toLowerCase());
                        if (n != -1) {
                            cmplr = wandbox.compilers_arr.normal[n];
                        }
                        else {
                            response.error(message, "invalid language/compiler name");
                            return;
                        }
                    }
                    let c = message.content.slice(0, message.content.match(/\r\n|\r|\n|\t| /).index);
                    if (c.startsWith(' ')) {
                        c = c.slice(1, c.length);
                    }
                    if (c.endsWith(' ')) {
                        c = c.slice(0, c.length - 1);
                    }
                    code = message.content.replace(new RegExp(`${m}|${c}`, 'g'), "");
                    while (code.startsWith(" ") || code.startsWith("\r") || code.startsWith("\t") || code.startsWith("\n")) {
                        code = code.slice(1, code.length);
                    }
                }
                else {
                    response.error(message, "no code provided");
                    return;
                }
            }
            wandbox.compile({
                "compiler": cmplr,
                "code": code
            }, 5000, (err, res, body) => {
                debug(err);
                let fields = {};
                if (body && body.program_output) {
                    if (body.program_output.length <= 1000) {
                        fields["Output"] = "```\n" + body.program_output.replace(/```/gi, "`​`​`") + "```";
                    }
                    else {
                        fields["Output"] = "```\n" + body.program_output.slice(0, 900).replace(/```/gi, "`​`​`") + "``` output too large, max limit : 1000 characters"
                    }
                }
                if (body && body.program_error) {
                    if (body.program_error.length <= 500) {
                        fields["Error"] = "```fix\n" + body.program_error.replace(/```/gi, "`​`​`") + "```";
                    }
                    else {
                        fields["Error"] = "```fix\n" + body.program_error.slice(0, 500).replace(/```/gi, "`​`​`") + "``` error too large, max limit : 500 characters"
                    }
                }
                if (body && body.compiler_error) {
                    if (body.compiler_error.length <= 500) {
                        fields["Compiler Error"] = "```fix \n" + body.compiler_error.replace(/```/gi, "`​`​`") + "```";
                    }
                    else {
                        fields["Compiler Error"] = "``` " + body.compiler_error.slice(0, 500).replace(/```/gi, "`​`​`") + "``` error too large, max limit : 500 characters"
                    }
                }
                if (!body) {
                    fields["Error"] = "```fix\nProgram timed out```";
                }
                if (body && body.status) {
                    fields["ExitCode"] = body.status;
                }
                fields["Compiler"] = cmplr;
                response.send(message,
                    response.create({
                        "author": message.author,
                        "mention": true,
                        "fields": fields,
                        "title": "Compiler result : ",
                        "linebreak": true,
                        "seperator": ":",
                        "error": "Something went wrong, compiler.js isn't working properly"
                    })
                );
            });
        }
        else {
            response.error(message, "no arguments provided");
        }
    } catch (error) {
        debug(error);
    }
}
