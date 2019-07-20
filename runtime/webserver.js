module.exports = () => {
    const app = express();
    app.all('*', (req, res) => {
        res.status(200);
        res.send('alive');
    });
    app.listen(process.env.PORT, () => debug(`initialized web server`));
}
