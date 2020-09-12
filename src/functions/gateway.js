import Express from 'express';
// services
import health from './api/health.api';
import calendly from './api/calendly.api';

const app = new Express();

app.use(health)
    .use(calendly);

export default app;
