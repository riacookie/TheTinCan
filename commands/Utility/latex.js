module.exports = async ({message, content}) => await response.create({
    message: message,
    title: 'LaTeX',
    image: {
        name: 'LaTeX.png',
        url: `https://chart.googleapis.com/chart?cht=tx&chl=${misc.urlEncode(misc.string.shiftWord(content))}`
    }
});
