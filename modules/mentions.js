module.exports.getUsers = (message) => new Promise(async (resolve, reject) => {
    try {
        let r = {
            members: [],
            users: [],
            code: 0,
        };
        let t = message.content.split(' ').length - 1;
        if (message.content.split(' ').length <= 1) {
            r.users.push(message.author);
            r.code = -1;
            if (message.guild) {
                let member;
                try {
                    member  = await message.guild.fetchMember(message.author.id);
                    } catch(error) {}
                if (member) {
                    r.members.push(member);
                }
            }
            resolve(r);
        }
        else {
            if (message.mentions.members && message.mentions.members.size > 0) {
                r.members.push(...message.mentions.members.values());
                r.users.push(...message.mentions.users.values());
                if (r.users.length == t) {
                    resolve(r);
                    return;
                }
            }
            else if (message.mentions.users && message.mentions.users.size > 0) {
                r.users.push(...message.mentions.users.values());
                if (r.users.length == t) {
                    resolve(r);
                    return;
                }
            }
            let arr = message.content.replace(/<|@|#|!|&|>/g, '').replace(/\r|\n|\t/g, ' ').split(' ');
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].length == 18 && Number(arr[i])) {
                    let user = await Client.fetchUser(arr[i]);
                    if (user) {
                        r.users.push(user);
                        if (message.guild) {
                            let member;
                            try {
                                member = await message.guild.fetchMember(user.id);
                            } catch(error) {}
                            if (member) {
                                r.members.push(member);
                            }
                        }
                    }
                }
                if(arr[i].includes('.')) {
                    let t = base64.decode(arr[i].slice(0, arr[i].indexOf('.')));
                    if (t.length == 18 && Number(t));
                    let user = await Client.fetchUser(t);
                    if (user) {
                        r.users.push(user);
                        if (message.guild) {
                            let member;
                            try {
                                member = await message.guild.fetchMember(user.id);
                            } catch(error) {}
                            if (member) {
                                r.members.push(member);
                            }
                        }
                    }
                }
            }
            if (message.guild) {
                let guild = await message.guild.fetchMembers();
                let members = [...guild.members.values()];
                for (let i = 0; i < members.length; i++) {
                    const member = members[i];
                    if (message.content.toLowerCase().includes(member.displayName.toLowerCase()) || message.content.toLowerCase().includes(member.user.username.toLowerCase())) {
                        r.members.push(member);
                        r.users.push(member.user);
                    }
                }
            }
            if (r.users.length > 0) {
                resolve(r);
                return;
            }
            else {
                r.users.push(message.author);
                r.code = -2;
                if (message.guild) {
                    let member;
                    try {
                        member = await message.guild.fetchMember(message.author.id);
                    } catch(error) {}
                    if (member) {
                        r.members.push(member);
                    }
                }
                resolve(r);
                return;
            }
        }
    } catch (error) {
        reject(error);
    }
});

module.exports.getUser = message => new Promise(async (resolve, reject) => {
    try {
        if (message.content.split(' ').length <= 1) {
            let r = {
                user: message.author,
                code: -1
            }
            if (message.guild) {
                let member;
                try {
                    member = await message.guild.fetchMember(message.author.id);
                } catch(error) {}
                if (member) {
                    r.member = member;
                }
            }
            resolve(r);
        }
        else {
            if (message.mentions.members && message.mentions.members.size > 0) {
                resolve({
                    member: message.mentions.members.first(),
                    user: message.mentions.members.first().user,
                    code: 0
                });
                return;
            }
            else if (message.mentions.users && message.mentions.users.size > 0) {
                resolve({
                    user: message.mentions.users.first(),
                    code: 1
                });
                return;
            }
            let arr = message.content.replace(/<|@|#|!|&|>/g, '').replace(/\r|\n|\t/g, ' ').split(' ');
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].length == 18 && Number(arr[i])) {
                    let user = await Client.fetchUser(arr[i]);
                    if (user) {
                        if (message.guild) {
                            let member;
                            try {
                                member = await message.guild.fetchMember(user.id);
                            } catch(error) {}
                            if (member) {
                                resolve({
                                    member: member,
                                    user: user,
                                    code: 2
                                });
                                return;
                            }
                        }
                        resolve({
                            user: user,
                            code: 3
                        });
                        return;
                    }
                }
                if(arr[i].includes('.')) {
                    let t = base64.decode(arr[i].slice(0, arr[i].indexOf('.')));
                    if (t.length == 18 && Number(t));
                    let user = await Client.fetchUser(t);
                    if (user) {
                        if (message.guild) {
                            let member;
                            try {
                                member = await message.guild.fetchMember(user.id);
                            } catch(error) {}
                            if (member) {
                                resolve({
                                    member: member,
                                    user: user,
                                    code: 4
                                });
                                return;
                            }
                        }
                        resolve({
                            user: user,
                            code: 5
                        });
                        return;
                    }
                }
            }
            if (message.guild) {
                let guild = await message.guild.fetchMembers();
                let members = [...guild.members.values()];
                for (let i = 0; i < members.length; i++) {
                    const member = members[i];
                    if (message.content.toLowerCase().includes(member.displayName.toLowerCase()) || message.content.toLowerCase().includes(member.user.username.toLowerCase())) {
                        resolve({
                            member: member,
                            user: member.user,
                            code: 6
                        });
                        return;
                    }
                }
            }
            let r = {
                user: message.author,
                code: -2
            }
            if (message.guild) {
                let member;
                try {
                    member = await message.guild.fetchMember(message.author.id);
                } catch(error) {}
                if (member) {
                    r.member = member;
                }
            }
            resolve(r);
            return;
        }
    } catch (error) {
        reject(error);
    }
});

module.exports.getRoles = message => new Promise((resolve, reject) => {
    try {
        if (message.guild) {
            let r = {
                roles: [],
                code: 0
            }
            if (message.content.split(' ').length <= 1) {
                r.code = -1;
                resolve(r);
            }
            else {
                let arr = [...message.guild.roles.values()];
                for (let i = 1; i < arr.length; i++) {
                    const role = arr[i];
                    if (message.content.toLowerCase().includes(role.name.toLowerCase()) || message.content.includes(role.id)) {
                        r.roles.push(role);
                    }
                }
                if (r.roles.length > 0) {
                    resolve(r);
                }
                else {
                    r.code = -2;
                    resolve(r);
                }
            }
        }
        else {
            reject();
        }
    } catch (error) {
        reject(error);
    }
});

module.exports.getRole = message => new Promise((resolve, reject) => {
    try {
        if (message.guild) {
            if (message.content.split(' ').length <= 1) {
                resolve({
                    code: -1
                });
                return;
            }
            else {
                let arr = [...message.guild.roles.values()];
                for (let i = 1; i < arr.length; i++) {
                    const role = arr[i];
                    if (message.content.toLowerCase().includes(role.name.toLowerCase()) || message.content.includes(role.id)) {
                        resolve({
                            role: role,
                            code: 0
                        });
                        return;
                    }
                }
                resolve({
                    code: -2
                });
            }
        }
        else {
            reject();
        }
    } catch (error) {
        reject(error);
    }
});

module.exports.getChannels = message => new Promise((resolve, reject) => {
    try {
        if (message.guild) {
            let r = {
                channels: [],
                code: 0
            }
            if (message.content.split(' ').length <= 1) {
                r.code = -1;
                resolve(r);
            }
            else {
                let arr = [...message.guild.channels.values()];
                for (let i = 1; i < arr.length; i++) {
                    const channel = arr[i];
                    if (message.content.toLowerCase().includes(channel.name.toLowerCase()) || message.content.includes(channel.id)) {
                        r.channels.push(channel);
                    }
                }
                if (r.channels.length > 0) {
                    resolve(r);
                }
                else {
                    r.code = -2;
                    resolve(r);
                }
            }
        }
        else {
            reject();
        }
    } catch (error) {
        reject(error);
    }
})

module.exports.getChannel = message => new Promise((resolve, reject) => {
    try {
        if (message.guild) {
            if (message.content.split(' ').length <= 1) {
                resolve({
                    code: -1
                });
                return;
            }
            else {
                let arr = [...message.guild.channels.values()];
                for (let i = 1; i < arr.length; i++) {
                    const channel = arr[i];
                    if (message.content.toLowerCase().includes(channel.name.toLowerCase()) || message.content.includes(channel.id)) {
                        resolve({
                            channel: channel,
                            code: 0
                        });
                        return;
                    }
                }
                resolve({
                    code: -2
                });
            }
        }
        else {
            reject();
        }
    } catch (error) {
        reject(error);
    }
})

module.exports.getNumbers = message => new Promise((resolve, reject) => {
    try {
        let arr = message.content.split(' ');
        if (arr.length <= 1) {
            resolve({
                code: -1
            });
        }
        else {
            let r = {
                numbers: [],
                code: 0
            }
            for (let i = 0; i < arr.length; i++) {
                const word = arr[i];
                if (word.length != 18 && (Number(word) || Number(word) == 0)) {
                    r.numbers.push(Number(word));
                }
            }
            if (r.numbers.length > 0) {
                resolve(r);
            }
            else {
                r.code = -2;
                resolve(r);
            }
        }
    } catch (error) {
        reject(error);
    }
})

module.exports.getNumber = message => new Promise((resolve, reject) => {
    try {
        let arr = message.content.split(' ');
        if (arr.length <= 1) {
            resolve({
                code: -1
            });
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                const word = arr[i];
                if (word.length != 18 && (Number(word) || Number(word) == 0)) {
                    resolve({
                        number: Number(word),
                        code: 0
                    });
                    return;
                }
            }
            resolve({
                code: -2
            });
        }
    } catch (error) {
        reject(error);
    }
})

module.exports.hasWord = async (str, word) => {
    str = str.replace(/\r|\n|\t/, ' ').replace(prefix, ' ');
    if (str.endsWith(` ${word}`)) return true;
    if (str.includes(` ${word} `)) return true;
    return false;
}

module.exports.getLanguage = async message => {
    for (let i = 0; i < wandbox.languages.lower.length; i++) {
        const language = wandbox.languages.lower[i];
        if (await this.hasWord(message.content.toLowerCase(), language)) {
            return wandbox.languages.normal[i];
        }
    }
}

module.exports.getCompiler = async message => {
    let lang = await this.getLanguage(message);
    let compiler;
    if (lang) {
        let i = 0;
        do {
            compiler = wandbox.compilers.normal[lang][i++];
        } while (compiler.includes('head'));
        return [compiler, lang];
    }
    else {
        for (let i = 0; i < wandbox.compilers_arr.lower.length; i++) {
            const cmplr = wandbox.compilers_arr.lower[i];
            if (await this.hasWord(message.content.toLowerCase(), cmplr)) {
              return [wandbox.compilers_arr.normal[i]];
            }
        }
    }
    return [];
}

module.exports.getCode = async (message, o) => {
    let code = shiftWord(message.content);
    if (o && code.replace(/\r|\n|\t| /g, '').toLowerCase().startsWith(o.toLowerCase())) {
        o = o.toLowerCase();
        let arr = message.content.replace(/\r|\n|\t/g, ' ').split(' ');
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].toLowerCase() == o) {
                code = code.replace(arr[i], '');
            }
            if (arr[i].startsWith('```')) {
                code = code.replace(arr[i], '');
                break;
            }
        }
        if (code.lastIndexOf('```') != -1) {
            code = code.slice(0, code.lastIndexOf('```'));
        }
    }
    let clean = () => {
        while ([' ', '\r', '\n', '\t'].includes(code.slice(0, 1))) {
            code = code.slice(1);
        }
    }
    clean();
    if (code.startsWith('```')) {
        let line = code.slice(0, code.search(/\r\n|\n|\r/));
        if (!line.includes(' ')) {
            code = code.replace(line, '');
        }
        else {
            code = code.replace('```', '');
        }
        if (code.indexOf('```') != -1) {
            code = code.substring(0, code.lastIndexOf('```'));
        }
    }
    clean();
    return code;
}
