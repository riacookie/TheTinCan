module.exports = async ({ message, content, command }) => {
    let word = misc.string.shiftWord(content).replace(/`/g, '');
    if (word == '') return await response.create({
        message: message,
        error: 'No input provided'
    });
    let [res, body] = await requestAsync.get({
        url: `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${misc.urlEncode('define ' + word)}&output=json`,
        json: true
    });
    if (
        !body ||
        !body.queryresult ||
        body.queryresult.error ||
        !body.queryresult.success ||
        !body.queryresult.pods
    ) {
        return await response.create({
            message: message,
            error: 'Are you sure the word exists?'
        });
    }
    let result = {
        message: message,
        title: '',
        fields: ''
    };
    for (let pod of body.queryresult.pods) {
        if (pod.numsubpods > 0) {
            if (pod.id == 'Input') {
                result.title = pod.subpods[0].plaintext.split(/ +\||\|/)[0];
            }
            else if (pod.title == 'Result') {
                result.fields = pod.subpods[0].plaintext
                break;
            }
        }
    }
    if (!result.fields) return await response.create({
        message: message,
        error: 'Failed to fetch definition'
    });
    else if (result.fields.includes('|')) {
        let arr = result.fields.split('\n');
        result.fields = [];
        for (let i = 0; i < arr.length; i++) {
            const line = arr[i];
            const _arr = line.split('|');
            arr[i] = _arr[2] || _arr[1] || _arr[0] || line;
            if (!arr[i].endsWith('meanings)')) result.fields.push(arr[i]);
        }
    }
    return await response.create(result);
}
