module.exports.string = {};

module.exports.string.nthIndexOf = (str, substr, n) => {
    let _n = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == substr) _n++;
        else if (substr instanceof Array && substr.includes(str[i])) _n++;
        if (_n == n) return i;
    }
}

module.exports.string.lastNthIndexOf = (str, substr, n) => {
    let _n = 0;
    for (let i = --str.length; i >= 0; i--) {
        if (str[i] == substr) _n++;
        if (_n == n) return i;
    }
}

module.exports.string.nthWord = (str, n, s = / |\r|\n|\t/) => {
    let [_n, r] = [0, ''];
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const m = c.match(s);
        if (_n >= n) break;
        if (_n == n - 1 && !m) r += c;
        if (m && (i == 0 || !str[i - 1].match(s))) _n++;
    }
    return r;
}

module.exports.string.lastNthWord = (str, n, s = / |\r|\n|\t/) => {
    let [_n, r] = [0, ''];
    for (let i = --str.length; i >= 0; i--) {
        const c = str[i];
        const m = c.match(s);
        if (_n >= n) break;
        if (_n == n - 1 && !m) r = c + r;
        if (m && (i == 0 || !str[i - 1].match(s))) _n++;
    }
    return r;
}

module.exports.string.shiftWords = (str, n, s = / |\r|\n|\t/) => {
    let [_n, r] = [0, ''];
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const m = c.match(s);
        if (_n == n && !m) {
            r = str.slice(i);
            break;
        }
        if (m && (i == 0 || !str[i - 1].match(s))) _n++;
    }
    return r;
}

module.exports.string.popWords = (str, n, s = / |\r|\n|\t/) => {
    let [_n, r] = [0, ''];
    for (let i = str.length - 1; i >= 0; i--) {
        const c = str[i];
        const m = c.match(s);
        if (_n == n && !m) {
            r = str.slice(0, str[i + 1] != undefined ? i + 1 : i);
            break;
        }
        if (m && (i == 0 || !str[i - 1].match(s))) _n++;
    }
    return r;
}

module.exports.string.tillNthWord = (str, n, s = / |\r|\n|\t/) => {
    let [_n, r] = [0, ''];
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const m = c.match(s);
        if (_n == n && !m) {
            r = str.slice(0, i - 1);
            break;
        }
        if (m && (i == 0 || !str[i - 1].match(s))) _n++;
    }
    if (r == '') r = str;
    return r;
}

module.exports.string.totalCharMatches = (str, c) => {
    let n = 1;
    for (let i = 0; i < str.length; i++) {
        const _c = str[i];
        const m = _c.match(c);
        if (m && (i == 0 || !str[i - 1].match(c))) n++;
    }
    return n;
}

module.exports.string.splitWords = (str, s = / +|\r\n+|\r+|\n+|\t+/) => str.split(s);

module.exports.string.hasWord = (str, word, s = / |\r|\n|\t/) => {
    let w = '';
    if (this.string.lastNthWord(str, 1) == word) return true;
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const m = c.match(s);
        if (!m) w += c;
        if (m && (i == 0 || !str[i - 1].match(s))) {
            if (word == w) return true;
            w = '';
        }
    }
    return false;
}

module.exports.string.hasAnyWord = (str, words, s = / |\r|\n|\t/) => {
    let w = '';
    if (words.includes(this.string.lastNthWord(str, 1))) return true;
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const m = c.match(s);
        if (!m) w += c;
        if (m && (i == 0 || !str[i - 1].match(s))) {
            if (words.includes(w)) return true;
            w = '';
        }
    }
    return false;
}

module.exports.string.firstWord = str => this.string.nthWord(str, 1);
module.exports.string.lastWord = str => this.string.lastNthWord(str, 1);
module.exports.string.shiftWord = str => this.string.shiftWords(str, 1);
module.exports.string.popWord = str => this.string.popWords(str, 1);
module.exports.string.wordAmount = str => this.string.totalCharMatches(str, / |\r|\n|\t/)
module.exports.string.lineAmount = str => this.string.totalCharMatches(str, /\r|\n/);
module.exports.string.forEachWord = (str, callback) => new Promise(async(resolve, reject) => {
    let words = this.string.splitWords(str);
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        await callback(word, i);
    }
    resolve();
});
module.exports.encode = (str, t) => Buffer.from(str).toString(t);
module.exports.decode = (str, t) => Buffer.from(str, t).toString();

module.exports.urlEncode = str => {
    let r = '';
    for (let i = 0; i < str.length; i++) {
        r += `%${this.encode(str[i], 'hex')}`;
    }
    return r;
}

module.exports.normalizeType = str => {
    if (!str || (typeof str == 'string' && str.toLowerCase() == 'true')) str = true;
    if (typeof str == 'string' && str.toLowerCase() == 'false') str = false;
    return typeof str == 'string' ? Number(str) || str : str;
}

module.exports.object = {};

module.exports.object.flipObject = obj => {
    let r = {};
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        r[obj[keys[i]]] = keys[i];
    }
    return r;
}

module.exports.object.toLowerCaseKeys = obj => {
    let r = {};
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        r[key.toLowerCase()] = obj[key];
    }
    return r;
}

module.exports.number = {};

module.exports.number.arr = (min, max) => {
    let r = [];
    if (min <= max) {
        for (let i = min; i <= max; i++) {
            r.push(i);
        }
    }
    return r;
}

module.exports.number.rows = (columns, elements) => Math.ceil(elements/columns);
module.exports.number.row = (row, columns, elements) => (row - 1) * columns;

module.exports.array = {};

module.exports.array.page = async(page, columns, arr) => {
    let r = {};
    let rows = this.number.rows(columns, arr.length);
    if (page > rows) page = rows;
    let [_arr, n] = (_ => [arr.slice(_, _ + columns), _])(this.number.row(page, columns, arr.length));
    for (let i = 0; i < _arr.length; i++) {
        r[i + n + 1] = _arr[i];
    }
    return r;
}

module.exports.array.last = arr => arr[arr.length - 1];

module.exports.random = {};

module.exports.random.int = (x, y) => Math.floor(x + Math.random() * (y + 1 - x));
module.exports.random.element = obj => {
    if (!obj instanceof Array) {
        let keys = Object.keys(obj);
        return obj[keys[this.random.int(0, keys.length - 1)]];
    }
    return obj[this.random.int(0, obj.length)];
}
module.exports.random.boolean = () => Math.round(Math.random()) == 1;

module.exports.formatting = {};

module.exports.formatting.zwspWrap = str => {
    let r = characters.zwsp;
    for (let i = 0; i < str.length; i++) {
        r += str[i] + characters.zwsp;
    }
    return r;
}

module.exports.formatting.plain = str => {
    if (str && str[0]) {
        return str[0].toUpperCase() + str.slice(1);
    }
}

module.exports.formatting.normal = (_str, options) => {
    let str = _str;
    if (_str) {
        str = _str.toString();
        str = str.replace(/\${(\w*)}/g, (s, m) => {
            switch (m) {
                case 'channel_id': {
                    return options.channel.id;
                }
                case 'client_id': {
                    return options.client.id
                },
                case 'prefix': {
                    return prefix
                },
                case 'options_prefix': {
                    return options_prefix
                },
                case 'channel_name': {
                    return options.channel.name
                },
                case 'author_id': {
                    return options.author.id
                },
                case 'author_username': {
                    return options.author.username
                }
                case: 'author_tag': {
                    return options.author.tag
                }
                default:
                    return s;
            }
        })
        if (str && !(['.', '`', '?', '!'].includes(str[str.length-1]))) return str + '.';
    }
    return str;
}

module.exports.formatting.codeBlock = (text, lang, limits, name) => `\`\`\`${lang}\n${text.replace(/```/gi, this.formatting.zwspWrap(text))}\`\`\``;

module.exports.formatting.codeBlockLimited = (str, lang, limit, name) => {
    if (limit) {
        let n = this.string.lineAmount(str);
        let r = str;
        let f = [''];
        if (r.length > limit.characters) {
            r = r.slice(0, limits.characters);
            f.push(`${name || 'result'} contained too much characters, Maximum character limit : ${limit.characters}.`);
        }
        if (n > limit.lines) {
            r = r.slice(0, this.string.nthIndexOf(r, /\r|\n/, limit.lines));
            f.push(`${name || 'result'} contained too much lines, Maximum line limit : ${limit.lines}.`);
        }
        return this.formatting.codeBlock(r, lang) + f.join('\n');
    }
    return this.formatting.codeBlock(str, lang);
}
