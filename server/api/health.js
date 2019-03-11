import Express from 'express';
import colors from 'colors';
import moment from 'moment';

const app = Express();
const message = 'HEALTH CHECK: All systems running!';
const timestamp = moment().format('MMM DD, YYY hh:mm A');

console.info(`${colors.green(message)} | ${colors.yellow(timestamp)}`);

app.get('/health', (req, res) => {
    res.send(`${message} at ${timestamp}`);
});

export default app;
