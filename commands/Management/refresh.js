module.exports = async message => {
    try {
        let userIdentity = await management.identity.get(message.author.id);
        if (management.identity.compare(userIdentity, '>=', 'Administrator')) {
            await management.refresh();
            return await response.send(response.create({
                message: message,
                title: 'Refresh',
                fields: [
                    'Database cache was refreshed'
                ],
                noKey: true,
                error: 'Something went wrong, but the operation may have been completed successfully'
            }))
        }
        else {
            return await response.error({
                message: message,
                error: 'You don\'t meet the minimum identity requirement for using this command'
            });
        }
    } catch (error) {
        debug(error);
    }
}
