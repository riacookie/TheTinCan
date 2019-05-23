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
                    if (!body || !body.queryresult || body.queryresult.error || !body.queryresult.success) {
                        response.error(message, "invalid math")
                        return;
                    }
                    if (body.queryresult.pods) {
                        var config = {
                            "author": message.author,
                            "title": `Solution for "${m}" : `,
                            "mention": true,
                            "linebreak": true,
                            "seperator": ":",
                            "error": "Something went wrong, math.js isn't working properly"
                        }
                        for (let i = 0; i < body.queryresult.pods.length; i++) {
                            const pod = body.queryresult.pods[i]
                            if (pod.id == "Solution" || pod.id == "DecimalApproximation" || (pod.id == "Result" && pod.scanner != "Rational") && pod.numsubpods > 0) {
                                if (pod.subpods[0].plaintext) {
                                    config.fields = [pod.subpods[0].plaintext];
                                    if (pod.subpods[0].img.src) {
                                        config.fileurl = pod.subpods[0].img.src;
                                    }
                                    break;
                                }
                            }
                        }
                        if (!config.fields) {
                            for (let i = 0; i < body.queryresult.pods.length; i++) {
                                const pod = body.queryresult.pods[i]
                                if ((pod.title == "Result" || pod.id == "Solution" || pod.id == "DecimalApproximation" || pod.id == "Result") && pod.numsubpods > 0) {
                                    if (pod.subpods[0].plaintext) {
                                        config.fields = [pod.subpods[0].plaintext];
                                        if (pod.subpods[0].img.src) {
                                            config.fileurl = pod.subpods[0].img.src;
                                        }
                                        break;
                                    }
                                }
                            }
                            if (!config.fields) {
                                for (let i = 0; i < body.queryresult.pods.length; i++) {
                                    const pod = body.queryresult.pods[i]
                                    if (pod.scanner == 'Data' && pod.numsubpods > 0) {
                                        if (!(pod.id.includes('ChemicalNamesAndFormulas:') || pod.id.includes('ChemicalProperties:') || pod.id.includes('Thermodynamics:') || pod.id.includes('ReactionStructures:') || pod.id.includes('Constant:'))) {
                                            if (!config.fields) config.fields = {};
                                            if (pod.subpods[0].plaintext) {
                                                config.fields[pod.title] = pod.subpods[0].plaintext;
                                            }
                                        }
                                        else if (!config.fileurl && pod.id.includes('ReactionStructures:')) {
                                            if (pod.subpods[0].img.src) {
                                                config.fileurl = pod.subpods[0].img.src;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (config.fields) {
                            if (config.fileurl) {
                                request(
                                    {
                                        "url": config.fileurl,
                                        "method": 'GET',
                                        "encoding": null
                                    },
                                    ((err, res, imageBuffer) => {
                                        debug(err);
                                        config.file = imageBuffer;
                                        config.filename = "unknown.png";
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
