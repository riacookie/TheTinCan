module.exports = async({message, content, options}) => {
    if (
        !options.min ||
        !options.max ||
        typeof options.min != 'number' ||
        typeof options.max != 'number'
    ) return await response.create({
        message: message,
        error: 'You must specify two numbers'
    });
    return await response.create({
        message: message,
        title: `Random number between ${options.min}, ${options.max}`,
        fields: misc.random.int(options.min, options.max)
    });
}
