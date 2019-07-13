module.exports = async ({ message, content}) => {
    let problem = misc.string.shiftWord(content).replace(/`/g, '');
    if (problem == '') return await response.create({
        message: message,
        error: 'No input provided'
    });
    let [res, body] = await requestAsync.get({
        url: `http://api.wolframalpha.com/v2/query?appid=${process.env.wolfram_key}&input=${misc.urlEncode(problem)}&output=json`,
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
        title: `Solution for "${problem}"`,
        fields: {}
    };
    for (let pod of body.queryresult.pods) {
        if (pod.numsubpods > 0) {
            if (
                pod.id == 'Result' ||
                pod.id == 'Solution' ||
                pod.id == 'DecimalApproximation' ||
                (pod.scanner == 'Data' && !(
                    pod.id.includes('ChemicalNamesAndFormulas:') ||
                    pod.id.includes('ChemicalProperties:') ||
                    pod.id.includes('Thermodynamics:') ||
                    pod.id.includes('Constant:') ||
                    pod.id.includes('ReactionStructures:')
                ))
            ) {
                for (let i = 0; i < pod.subpods.length; i++) {
                    const subpod = pod.subpods[i];
                    if (pod.subpods.length == 1) result.fields[pod.title] = subpod.plaintext;
                    else {
                        if (!result.fields[pod.title]) result.fields[pod.title] = [];
                        result.fields[pod.title].push(subpod.plaintext);
                    }
                }
            }
        }
    }
    return await response.create(result);
}
