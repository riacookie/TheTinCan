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
                        let answer;
                        for (let i = 0; i < body.queryresult.pods.length; i++) {
                            const pod = body.queryresult.pods[i]
                            if (pod.id == "Solution" || pod.id == "DecimalApproximation" || (pod.id == "Result" && pod.scanner != "Rational") && pod.numsubpods > 0) {
                                answer = pod.subpods[0].plaintext
                                break;
                            }
                        }
                        if (!answer) {
                            for (let i = 0; i < body.queryresult.pods.length; i++) {
                                const pod = body.queryresult.pods[i]
                                if ((pod.id == "Solution" || pod.id == "DecimalApproximation" || pod.id == "Result") && pod.numsubpods > 0) {
                                    answer = pod.subpods[0].plaintext
                                    break;
                                }
                            }
                        }
                        if (answer) {
                            response.send(message, 
                                response.create({
                                    "author": message.author,
                                    "title": `Solution for "${m}" : `,
                                    "mention": true,
                                    "fields": [
                                        answer
                                    ],
                                    "seperator": ":",
                                    "error": "Something went wrong, math.js isn't working properly"
                                })
                            );    
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
