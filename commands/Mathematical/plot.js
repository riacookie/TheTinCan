module.exports = async message => {
    try {
        let equation = shiftWord(message.content).replace(/`/g, '');
        if (equation == '') {
            return await response.error({
                message: message,
                error: 'No equation provided'
            });
        }
        let res, body;
        try {
            [res, body] = await requestAsync.get({
                url: `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${urlEncode(`plot ${equation}`)}&output=json`,
                json: true,
                headers: {'User-Agent': 'request'}
            });
        } catch (error) {
            debug(error);
            return await response.error({
                message: message,
                error: 'Invalid input'
            });
        }
        if (!body || !body.queryresult || body.queryresult.error || !body.queryresult.success || !body.queryresult.pods) {
            return await response.error({
                message: message,
                error: 'Failed to fetch graph for given equation'
            });
        }
        let image = {};
        for (let i = 0; i < body.queryresult.pods.length; i++) {
            const pod = body.queryresult.pods[i]
            if (pod.scanner == 'Plot' && pod.numsubpods > 0) {
                image.url = pod.subpods[0].img.src;
                break;
            }
        }
        if (image.url) {
            try {
                [res, image.attachment] = await requestAsync({
                    url: image.url,
                    method: 'GET',
                    encoding: null
                });
                image.name = 'graph.png';
                return await response.send(response.create({
                    message: message,
                    error: 'failed to upload received graph',
                    image: image,
                    title: `Graph of "${equation}"`
                }));
            } catch (error) {
                debug(error);
                return await response.error({
                    message: message,
                    error: 'Faield to fetch received graph'
                });
            }
        }
        else {
            return await response.error({
                message: message,
                error: 'Can\'t graph given input'
            });
        }
    } catch(error) {
        debug(error);
    }
}
