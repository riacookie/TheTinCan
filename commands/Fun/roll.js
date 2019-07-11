module.exports = async ({message, options}) => {
    if (!options.amount) options.amount = 2;
    let results = [];
    for (let i = 1; i <= options.amount; i++) {
        results.push(misc.random.int(1, 6));
    }
    return await response.create({
        message: message,
        title: 'Rolled some die',
        fields: {
            Results: results
        },
        fields_config: {
            joinArr: true
        }
    });
}
