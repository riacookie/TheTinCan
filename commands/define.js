exports.run = (message) => {
    try {
        if (message.content.indexOf(" ") != -1) {
            let m = message.content.replace(new RegExp(message.content.slice(0, message.content.indexOf(" ")) + " "), "")
            m = m.replace(/`/gi, "");
            request.get(
                {
                    "url": `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${toHex('define ' + m)}&output=json`,
                    "json": true,
                    "headers": {'User-Agent': 'request'}
                },
                ((error, resource, body) => {
                    debug(error);
                    if (body.queryresult.error || !body.queryresult.success) {
                        response.error(message, "are you sure the word exists?")
                        return;
                    }
                    if (body.queryresult.pods) {
                        let answer;
                        for (let i = 0; i < body.queryresult.pods.length; i++) {
                            const pod = body.queryresult.pods[i]
                            if (pod.id == "Input" && pod.numsubpods > 0) {
                                m = pod.subpods[0].plaintext.split(/ \||\|/)[0];
                            }
                            if (pod.title == "Result" && pod.numsubpods > 0) {
                                answer = pod.subpods[0].plaintext
                                break;
                            }
                        }
                        if (answer) {
                            if (answer.includes("|")) {
                                let arr = answer.split("\n");
                                answer = {};
                                for (let i = 0; i < arr.length; i++) {
                                    const line = arr[i];
                                    arr[i] = line.split('|')[2] || line.split('|')[1] || line.split('|')[0] || line;
                                    answer[`${i}`] = arr[i];
                                }
                            }
                            else {
                                answer = [answer];
                            }
                            response.send(message, 
                                response.create({
                                    "author": message.author,
                                    "title": `Definition of ${m} : `,
                                    "mention": true,
                                    "fields": answer,
                                    "seperator": ".",
                                    "error": "Something went wrong, define.js isn't working properly"
                                })
                            );    
                        }
                        else {
                            response.error(message, "failed to get definition");
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
