module.exports = async ({ message, content, command }) => {
    let expression = misc.string.shiftWord(content).replace(/`/g, '');
    if (expression == '') return await response.create({
        message: message,
        error: 'No input provided'
    });
    let [res, body] = await requestAsync.get({
        url: `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${misc.urlEncode('plot ' + expression)}&output=json`,
        json: true
    });
    if (
        !body ||
        !body.queryresult ||
        body.queryresult.error ||
        !body.queryresult.success ||
        !body.queryresult.pods
    ) return await response.create({
        message: message,
        error: 'No solution found'
    });
    let result = {
        message: message,
        title: `Graph of "${expression}"`,
        image: {
            name: 'Graph.png',
            url: ''
        }
    };
    for (let pod of body.queryresult.pods) {
        if (pod.numsubpods > 0 && pod.scanner == 'Plot') {
            result.image.url = pod.subpods[0].img.src;
            break;
        }
    }
    if (!result.image.url) return await response.create({
        message: message,
        error: 'No graph found in received result'
    });
    return await response.create(result);
}
