module.exports = () => {
    const app = express();
    app.all('*', (req, res) => {
        res.status(200);
        res.send('alive');
    });
    app.listen(process.env.PORT, () => debug(`initialized web server`));
    setInterval(() => http.get(process.env.domain), 300000);
}
