module.exports.getUsers = async (content, message, members = false, limit = 5) => {
    let result = {
        users: [],
        members: []
    };
    let n = 0;
    await misc.string.forEachWord(content, async(word, index) => {
        if (n == limit) return;
        if (!word.trim()) return;
        async function check(id) {
            if (id) {
                let user = await client.fetchUser(id).catch($);
                if (user) {
                    result.users.push(user);
                    if (members && message.guild && message.guild.available) {
                        let member = await message.guild.fetchMember(user).catch($);
                        if (member) {
                            result.members.push(member);
                        }
                    }
                    n++;
                    return true;
                }
            }
        }
        if (await check(word.replace(/<|!|@|>/g, ''))) return;
        const _id = misc.decode(word.includes('.') ? word.slice(0, word.indexOf('.')) : word, 'base64').trim();
        if (Number(_id) && await check(_id)) return;
        if (message.guild && message.guild.available) {
            const word_lower = word.toLowerCase();
            for (let [id, member] of (await message.guild.fetchMembers(word, 1)).members.filter(m => m.user.tag.toLowerCase().startsWith(word_lower) || m.displayName.toLowerCase().startsWith(word_lower))) {
                if (member && member.user) {
                    result.users.push(member.user);
                    if (members) result.members.push(member);
                    n++
                    return;
                }
            }
        }
    });
    return result;
}

module.exports.getRoles = async (content, message, limit = 5) => {
    if (message.guild && message.guild.available) {
        content = content.replace(/<|@|&|>/g, '').toLowerCase();
        let result = [];
        let arr = [...message.guild.roles.values()];
        for (role of arr) {
            if (misc.string.hasAnyWord(content, [role.name.toLowerCase(), role.id])) result.push(role);
        }
        return result;
    }
}

module.exports.getChannels = async (content, message, limit = 5) => {
    if (message.guild && message.guild.available) {
        content = content.replace(/<|#|>/g, '').toLowerCase();
        let result = [];
        let arr = [...message.guild.channels.values()];
        for (role of arr) {
            if (misc.string.hasAnyWord(content, [role.name.toLowerCase(), role.id])) result.push(role);
        }
        return result;
    }
}

module.exports.getNumbers = async (content, limit = 5) => {
    let result = [];
    await misc.string.forEachWord(content, async(word, index) => {
        if (result.length >= limit) return;
        if (![NaN, Infinity].includes(Number(word))) result.push(word);
    });
    return result;
}

module.exports.getIdentities = async (content, limit = 5) => {
    let result = [];
    await misc.string.forEachWord(content, async(word, index) => {
        if (result.length >= limit) return;
        let pos = management.identity.getPosition(word);
        if (pos) result.push(pos);
    });
    return result;
}

module.exports.getLanguage = async content => {
    content = misc.string.tillNthWord(content, 3).toLowerCase().replace('```', ' ');
    for (let language of wandbox.normal.languages) {
        if (misc.string.hasWord(content, language.toLowerCase())) return language;
    }
}

module.exports.getCompiler = async content => {
    content = misc.string.tillNthWord(content, 3).toLowerCase().replace('```', ' ');
    for (let language of wandbox.normal.languages) {
        if (misc.string.hasWord(content, language.toLowerCase())) return {
            language: language,
            compiler: await wandbox.getCompiler(language),
            language_mention: true
        };
        for (let compiler of wandbox.normal.compilers[language]) {
            if (misc.string.hasWord(content, compiler.toLowerCase())) return {
                language: language,
                compiler: compiler,
                language_mention: false
            };
        }
    }
}

module.exports.getCode = async content => {
    if (content.includes('```')) {
        content = content.slice(0, content.lastIndexOf('```'));
    }
    if (misc.string.firstWord(content).startsWith('```')) {
        let r = misc.string.shiftWord(content);
        if (r) return r;
        else return content.slice(content.indexOf('```') + '```'.length);
    }
    else return content;
}
