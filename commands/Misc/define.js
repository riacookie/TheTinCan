module.exports = async message => {
    try {
        let word = shiftWord(message.content);
        if (word) {
            let [res, body] = await requestAsync.get({
                url: `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${urlEncode('define ' + word)}&output=json`,
                json: true,
                headers: { 'User-Agent': 'request' }
            })
            if (body.queryresult.error || !body.queryresult.success) {
                return await response.error({
                    message: message,
                    error: 'are you sure the word exists?'
                });
                return;
            }
            if (body.queryresult.pods) {
                let answer;
                for (let i = 0; i < body.queryresult.pods.length; i++) {
                    const pod = body.queryresult.pods[i]
                    if (pod.id == 'Input' && pod.numsubpods > 0) {
                        m = pod.subpods[0].plaintext.split(/ \||\|/)[0];
                    }
                    if (pod.title == 'Result' && pod.numsubpods > 0) {
                        answer = pod.subpods[0].plaintext
                        break;
                    }
                }
                if (answer) {
                    if (answer.includes('|')) {
                        let arr = answer.split('\n');
                        answer = {};
                        for (let i = 0; i < arr.length; i++) {
                            const line = arr[i];
                            arr[i] = line.split('|')[2] || line.split('|')[1] || line.split('|')[0] || line;
                            if (!arr[i].endsWith('meanings)')) answer[`${i + 1}`] = arr[i];
                        }
                    }
                    else {
                        answer = [answer];
                    }
                    return await response.send(response.create({
                        message: message,
                        author: message.author,
                        title: `Definition of ${m}`,
                        fields: answer,
                        seperator: '.',
                        error: 'Something went wrong, failed to return definition'
                    }));
                }
                else {
                    return await response.error({
                        message: message,
                        error: 'failed to get definition'
                    });
                }
            }
        }
        else {
            return await response.error({
                message: message,
                error: 'Invalid input'
            });
        }
    } catch (error) {
        debug(error);
    }
}
