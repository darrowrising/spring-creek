const Express = require('express');

const app = Express();
const message = 'HEALTH CHECK: All systems running!\n';
const timestamp = new Date().getTime();

console.info(`${message}: ${timestamp}`);

app.get('/health', (req, res) => {
    res.send(message);
});

module.exports = app;
