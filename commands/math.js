exports.run = (message) => {
    try {
        if (message.content.indexOf(" ") != -1) {
            let m = message.content.replace(new RegExp(message.content.slice(0, message.content.indexOf(" ")) + " "), "")
            m = m.replace(/`/gi, "");
            request.get(
                {
                    "url": `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${toHex(m)}&output=json`,
                    "json": true,
                    "headers": {'User-Agent': 'request'}
                },
                ((error, resource, body) => {
                    debug(error);
                    if (body.queryresult.error || !body.queryresult.success) {
                        response.error(message, "invalid math")
                        return;
                    }
                    if (body.queryresult.pods) {
                        let config = {
                            "author": message.author,
                            "title": `Solution for "${m}" : `,
                            "mention": true,
                            "seperator": ":",
                            "error": "Something went wrong, math.js isn't working properly"
                        }
                        for (let i = 0; i < body.queryresult.pods.length; i++) {
                            const pod = body.queryresult.pods[i]
                            if (pod.id == "Solution" || pod.id == "DecimalApproximation" || (pod.id == "Result" && pod.scanner != "Rational") && pod.numsubpods > 0) {
                                config.fields = [pod.subpods[0].plaintext];
                                config.fileurl = pod.subpods[0].img.src;
                                config.filename = pod.title;
                                break;
                            }
                        }
                        if (!config.fields) {
                            for (let i = 0; i < body.queryresult.pods.length; i++) {
                                const pod = body.queryresult.pods[i]
                                if ((pod.title == "Result" || pod.id == "Solution" || pod.id == "DecimalApproximation" || pod.id == "Result") && pod.numsubpods > 0) {
                                    config.fields = [pod.subpods[0].plaintext];
                                    break;
                                }
                            }
                            if (!config.fields) {
                                for (let i = 0; i < body.queryresult.pods.length; i++) {
                                    const pod = body.queryresult.pods[i]
                                    if (pod.scanner == 'Data' && pod.numsubpods > 0) {
                                        if (!(pod.id.includes('ChemicalNamesAndFormulas:') || pod.id.includes('ChemicalProperties:') || pod.id.includes('Thermodynamics:'))) {
                                            if (!config.fields) config.fields = {};
                                            config.fields[pod.title] = pod.subpods[0].plaintext;
                                        }
                                        else if (!config.fileurl && pod.id.includes('ReactionStructures:')) {
                                            config.fileurl = pod.subpods[0].img.src;
                                            config.filename = pod.title;
                                        }
                                    }
                                }
                            }
                        }
                        if (config.fields) {
                            if (config.fileurl) {
                                request(
                                    {
                                        "url": imageURL,
                                        "method": 'GET',
                                        "encoding": null
                                    },
                                    ((err, res, imageBuffer) => {
                                        debug(err);
                                        if (imageBuffer) {
                                            config.file = imageBuffer;
                                        }
                                        response.send(message, response.create(config));
                                    })
                                );
                            }
                            else {
                                response.send(message, response.create(config));
                            }   
                        }
                        else {
                            response.error(message, "failed to get solution");
                        }
                    }
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
