exports.run = (message) => {
    try {
        if (message.content.indexOf(" ") != -1) {
            let m = message.content.replace(new RegExp(message.content.slice(0, message.content.indexOf(" ")) + " "), "")
            let imageURL = `https://chart.googleapis.com/chart?cht=tx&chl=${toHex(m)}`;
            request(
                {
                    "url": imageURL,
                    "method": 'GET',
                    "encoding": null
                },
                ((err, res, imageBuffer) => {
                    debug(err)
                    response.send(message,
                        response.create({
                            "author": message.author,
                            "title": `LaTeX :`,
                            "file": imageBuffer,
                            "filename": "LaTeX.png",
                            "fileurl": imageURL,
                            "mention": true,
                            "error": "Something went wrong, latex.js isn't working properly"
                        })
                    )
                })
            )
        }
        else {
            response.error(message, "no input provided");
        }
    } catch (error) {
        debug(error);
    }
}
