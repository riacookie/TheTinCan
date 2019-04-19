exports.run = (message) => {
    try {
        let cmd = message.content.split(" ");
        cmd.shift();
        cmd = cmd.join(" ");
        if (cmd == "" || cmd == " ") {
            firebase.get("/bot/commands/list", (data, error) => {
                if (data) {
                    response.send(message,
                        response.create({
                            "author": message.author,
                            "title": "Commands : ",
                            "fields": data,
                            "seperator": ":",
                            "linebreak": true,
                            "error": "Something went wrong, help.js isn't working properly (ErrorCode : help.js - 1)"
                        })
                    );
                }
            })
        }
        else {
            firebase.get("/bot/commands/", (data, error) => {
                if (error) {
                    debug(error);
                    response.error(message, "Something went wrong, help.js failed to fetch /bot/commands/ (ErrorCode : help.js - 2)");
                }
                if (data) {
                    if (data.files[cmd.toLowerCase()]) {
                        let info = data.info[cmd.toLowerCase()]
                        response.send(message,
                            response.create({
                                "author": message.author,
                                "title": ` /Commands/${cmd} : `,
                                "fields": {
                                    "Command": info.command,
                                    "Info": info.info,
                                    "Usage": info.usage,
                                    "Example": info.example
                                },
                                "seperator": ":",
                                "linebreak": true,
                                "error": "Something went wrong, help.js isn't working properly (ErrorCode : help.js - 2)"
                            })
                        );
                    }
                    else {
                        response.error(message, `Can't find command "${cmd}"`);
                    }
                }
            })
        }
    } catch (error) {
        debug(error);
    }
}
