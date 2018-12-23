const path = require('path');
const Express = require('express');
const env = require('./../utils/env');

const __rootPath = __dirname.replace('server', '');
const app = new Express();

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.use('/static', Express.static(`${__rootPath}/${env().publicPath}`));

module.exports = app;
