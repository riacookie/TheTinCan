module.exports = async message => {
    try {
        let input = shiftWord(message.content).replace(/`/g, '');
        if (input) {
            let image = {
                url: `https://chart.googleapis.com/chart?cht=tx&chl=${urlEncode(input).replace(/%20/g, '+')}`,
                name: 'LaTeX.png'
            };
            let [res, body] = await requestAsync({
                url: image.url,
                method: 'GET',
                encoding: null
            });
            if (body) {
                image.attachment = body;
                return await response.send(response.create({
                    message: message,
                    error: 'Failed to return latex',
                    title: `LaTeX of "${input}"`,
                    image: image
                }));
            }
            else {
                return await response.send(response.create({
                    message: message,
                    error: 'Failed to fetch image buffer'
                }))
            }
        }
        else {
            return await response.send(response.create({
                message: message,
                error: 'Invalid input'
            }));
        }
    } catch(error) {
        debug(error);
    }
}
