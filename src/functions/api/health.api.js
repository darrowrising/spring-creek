import Express from 'express';
import colors from 'colors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const app = Express();
const message = 'HEALTH CHECK: All systems running!';
const timestamp = dayjs.utc().local().format('MMM DD, YYY hh:mm A');

console.info(`${colors.green(message)} | ${colors.yellow(timestamp)}`);

app.get('/health', (req, res) => {
  res.send(`${message} at ${timestamp}`);
});

export default app;
