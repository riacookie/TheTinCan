exports.getUser = async(message) => {
    let users = [];
    let arr = message.content.replace(/<|@|>|!|#|&|:/gi, "").split(" ");
    if (arr.length <= 1) {
        if (message.guild) {
            users.push(await message.guild.fetchMember(message.author.id));
            return {
                "users": users,
                "guild": true,
                "exitcode": -1
            };
        }
        return {
            "users": [ message.author ],
            "guild": false,
            "exitcode": -2
        };
    }
    if (message.guild) {
        for (let i = 0; i < arr.length; i++) {
            const word = arr[i];
            if (Number(word) && word.length == 18) {
                let user = await client.fetchUser(word);
                if (user) {
                    try {
                        let member = await message.guild.fetchMember(user);
                        if (member) {
                            users.push(member);
                        }
                    } catch (error) {}
                }
            }
        }
        if (users.length != 0) {
            return {
                "users": users,
                "guild": true,
                "exitcode": 2
            };
        };
        let memberlist = (await message.guild.fetchMembers()).members;
        for (let i = 0; i < arr.length; i++) {
            const word = arr[i];
            var m = memberlist.find(member => {
                if (member && member.user && member.user.username) {
                    if (member.user.username.toLowerCase() == word.toLowerCase() || member.user.tag.toLowerCase() == word.toLowerCase() || member.displayName.toLowerCase() == word.toLowerCase()) {
                        return true;
                    }
                }
            });
            if (m) {
                users.push(m);
            }
        }
        if (users.length != 0) {
            return {
                "users": users,
                "guild": true,
                "exitcode": 3
            };
        }
    }
    if (message.mentions.users.length != 0) {
        users = [...users, ...(message.mentions.users.array())];
        if (users.length != 0) {
            return {
                "users": users,
                "guild": false,
                "exitcode": 4
            };
        }
    }
    for (let i = 0; i < arr.length; i++) {
        const word = arr[i];
        if (Number(word) && word.length == 18) {
            let user = await client.fetchUser(word);
            if (user) {
                users.push(user);
            }
        }
    }
    if (users.length != 0) {
        return {
            "users": users,
            "guild": false,
            "exitcode": 5
        };
    };
    if (message.guild) {
        users.push(await message.guild.fetchMember(message.author));
        return {
            "users": users,
            "guild": true,
            "exitcode": -3
        };
    }
    return {
        "users": [ message.author ],
        "guild": false,
        "exitcode": -4
    };
}

exports.getRole = async(message) => {
    let results = [];
    let text = message.content.toLowerCase().replace(/\<|\>|\@|\&|\!|\#/gi);
    if (!message.guild) {
        return {
            "roles": [],
            "exitcode": -1
        };
    }
    message.guild.roles.forEach(role => {
        if (text.contains(role.name.toLowerCase()) || text.contains(role.id)) {
            results.push(role);
        }
    });
    if (results.length != 0) {
        return {
            "roles": results,
            "exitcode": 1
        }
    };
    return {
        "roles": [],
        "exitcode": -2
    };
}

exports.getNumber = async(message) => {
    let results = [];
    message.content.split(" ").forEach(word => {
        if (Number(word) && word.length != 18) {
            results.push(Number(word));
        }
    });
    if (results.length != 0) {
        return {
            "numbers": results,
            "exitcode": 1
        };
    }
    return {
        "numbers": [],
        "exitcode": -1
    };
}

