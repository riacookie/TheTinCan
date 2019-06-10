module.exports = async message => {
    try {
        let math = shiftWord(message.content).replace(/`/g, '');
        if (math == '') {
            return await response.error({
                message: message,
                error: 'No input provided'
            });
        }
        let res, body;
        try {
            [res, body] = await requestAsync.get({
                url: `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${urlEncode(math)}&output=json`,
                json: true,
                headers: {'User-Agent': 'request'}
            });
            if (!body || !body.queryresult || body.queryresult.error || !body.queryresult.success || !body.queryresult.pods) {
                return await response.error({
                    message: message,
                    error: 'Can\'t find a solution'
                });
            }
            let config = {
                author: message.author,
                message: message,
                title: math.toString(),
                error: 'Failed to reply with answer',
                fields: {}
            };
            for (let i = 0; i < body.queryresult.pods.length; i++) {
                const pod = body.queryresult.pods[i];
                if (pod.numsubpods > 0) {
                    if (pod.id == 'Result' || pod.id == 'Solution' || pod.id == 'DecimalApproximation') {
                        config.fields[pod.title] = pod.subpods[0].plaintext;
                        if (pod.subpods[0].img.src && !config.image) {
                            config.image = {};
                            config.image.url = pod.subpods[0].img.src;
                        }
                    }
                    else if (pod.scanner == 'Data') {
                        if (!(pod.id.includes('ChemicalNamesAndFormulas:') || pod.id.includes('ChemicalProperties:') || pod.id.includes('Thermodynamics:') || pod.id.includes('ReactionStructures:') || pod.id.includes('Constant:'))) {
                            if (pod.subpods[0].plaintext) {
                                config.fields[pod.title] = pod.subpods[0].plaintext;
                            }
                        }
                        else if (!config.fileurl && pod.id.includes('ReactionStructures:')) {
                            config.image = {};
                            if (pod.subpods[0].img.src) {
                                config.image.url = pod.subpods[0].img.src;
                            }
                        }
                    }
                }
            }
            if (Object.keys(config.fields).length < 1) {
                return await response.error({
                    message: message,
                    error: 'Can\'t find any solution in received result'
                });
            }
            if (config.image) {
                config.image.name = 'image.png';
                try {
                    [res, config.image.attachment] = await requestAsync({
                        url: config.image.url,
                        method: 'GET',
                        encoding: null
                    });
                } catch (error) {
                    debug(error);
                    config.image = undefined;
                }
            }
            return await response.send(response.create(config));
        } catch (error) {
            debug(error);
            return await response.error({
                message: message,
                error: 'Invalid input'
            });
        }
    } catch (error) {
        debug(error);
    }
}
