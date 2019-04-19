exports.run = (message) => {
    try {
        if (message.content.indexOf(" ") != -1) {
            let m = message.content.replace(new RegExp(message.content.slice(0, message.content.indexOf(" ")) + " "), "")
            request.get(
                {
                    "url": `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${toHex("plot " + m)}&output=json`,
                    "json": true,
                    "headers": {'User-Agent': 'request'}
                },
                ((error, resource, body) => {
                    debug(error);
                    if (body.queryresult.error || !body.queryresult.success) {
                        response.error(message, "invalid equation")
                        return;
                    }
                    if (body.queryresult.pods) {
                        let imageURL;
                        for (let i = 0; i < body.queryresult.pods.length; i++) {
                            const pod = body.queryresult.pods[i]
                            if (pod.scanner == "Plot" && pod.numsubpods > 0) {
                                imageURL = pod.subpods[0].img.src
                                break;
                            }
                        }
                        if (imageURL) {
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
                                            "title": `Graph of ${m} : `,
                                            "file": imageBuffer,
                                            "filename": "Plot.png",
                                            "fileurl": imageURL,
                                            "mention": true,
                                            "error": "Something went wrong, plot.js isn't working properly"
                                        })
                                    )
                                })
                            )
                        }
                        else {
                            response.error(message, "failed to plot a graph for given equation");
                        }
                    }
                })
            )
        }
        else {
            response.error(message, "no equation provided");
        }    
    } catch (error) {
        debug(error);
    }
}
