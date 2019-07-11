module.exports.init = async() => {
    module.exports.normal = {
        languages: [],
        languages_default: [],
        compilers: {}
    };
    module.exports.lower = {
        languages: [],
        languages_default: [],
        compilers: {}
    };
    b = (await requestAsync.get({
        url: 'https://wandbox.org/api/list.json',
        json: true
    }).catch(debug))[1];
    for (let i = 0; i < b.length; i++) {
        const compiler = b[i];
        if (!bot_data.languages.blacklisted.includes(compiler.language)) {
            const [compiler_name, language, compiler_name_lower, language_lower] = [
                compiler.name,
                compiler.language,
                compiler.name.toLowerCase(),
                compiler.language.toLowerCase()
            ];
            if (!this.normal.compilers[language]) {
                [module.exports.normal.compilers[language], module.exports.lower.compilers[language_lower]] = [[], []];
                module.exports.normal.languages.push(language);
                module.exports.lower.languages.push(language_lower);
            }
            module.exports.normal.compilers[language].push(compiler_name);
            module.exports.lower.compilers[language_lower].push(compiler_name_lower);
        }
    }
    module.exports.normal.languages_default = [...this.normal.languages];
    module.exports.lower.languages_default = [...this.lower.languages];
    let custom_languages = Object.keys(bot_data.languages.custom);
    for (let i = 0; i < custom_languages.length; i++) {
        const custom_lang = custom_languages[i];
        const lang = bot_data.languages.custom[custom_lang];
        const [custom_lang_lower, lang_lower] = [custom_lang.toLowerCase(), lang.toLowerCase()];
        module.exports.normal.languages.push(custom_lang);
        module.exports.lower.languages.push(custom_lang_lower);
        module.exports.normal.compilers[custom_lang] = module.exports.normal.compilers[lang];
        module.exports.lower.compilers[custom_lang_lower] = module.exports.lower.compilers[lang_lower];
    }
    delete b;
    delete custom_languages;
    module.exports.exists = {
        compiler: async compiler => {
            compiler = compiler.toLowerCase();
            for (let i = 0; i < this.lower.languages.length; i++) {
                const lang = this.lower.languages[i];
                const cmplrs = this.lower.compilers[lang];
                for (let j = 0; j < cmplrs.length; j++) {
                    const cmplr = cmplrs[j];
                    if (cmplr == compiler) return this.normal.compilers[this.normal.languages[i]][j];
                }
            }
        },
        language: async lang => {
            lang = lang.toLowerCase();
            for (let i = 0; i < this.lower.languages.length; i++) {
                const _lang = this.lower.languages[i];
                if (_lang == lang) return this.normal.languages[i];
            }
        }
    }
    module.exports.getCompiler = async lang => {
        let compilers = this.normal.compilers[lang];
        if (!compilers) compilers = this.normal.compilers[this.exists.language(lang)];
        let compiler = '';
        for (let i = 0; i < compilers.length; i++) {
            compiler = compilers[i];
            if (!compiler.includes('head')) break;
        }
        return compiler;
    }
    module.exports.getLanguage = async compiler => {
        compiler = compiler.toLowerCase();
        for (let i = 0; i < this.lower.languages.length; i++) {
            const lang = this.lower.languages[i];
            const cmplrs = this.lower.compilers[lang];
            for (let j = 0; j < cmplrs.length; j++) {
                const cmplr = cmplrs[j];
                if (cmplr == compiler) return this.normal.languages[i];
            }
        }
    }
    module.exports.compile = async (options, timeout = 5000) => {
        return await requestAsync.post({
            url: 'https://wandbox.org/api/compile.json',
            body: options,
            json: true,
            timeout: timeout,
            headers: {'User-Agent': 'request'}
        }).catch(debug);
    }
}
