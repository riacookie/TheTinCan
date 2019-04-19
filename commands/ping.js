exports.run = (message) => {
    try {
        response.send(message, {
            "text": "Ping?",
            "mention": true,
            "error": "Something went wrong, ping.js isn't working properly (ErrorCode : ping.js - 1)",
            "callback": (msg, error) => {
                if (msg) {
                    response.send(message, 
                        response.create({
                            "edit": msg,
                            "author": message.author,
                            "title": "Pong!",
                            "mention": true,
                            "fields": {
                                "Reply Speed": `${msg.createdTimestamp - message.createdTimestamp}ms`,
                                "API Speed": `${Math.round(client.ping)}ms`
                            },
                            "seperator": ":",
                            "error": "Something went wrong, ping.js isn't working properly (ErrorCode : ping.js - 2)"
                        })
                    );
                }
            }
        })
    } catch (error) {
        debug(error);
    }
}
