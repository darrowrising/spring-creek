import path from 'path';
import Express from 'express';
import colors from 'colors';
import bodyParser from 'body-parser';
import openBrowser from 'react-dev-utils/openBrowser'; // eslint-disable-line

import staticFiles from './lib/staticFiles';
import health from './api/health';
import headers from './lib/headers';
import envHandler from './utils/env';
import webpackMiddleware from './utils/webpackMiddleware';

const app = new Express();
const env = envHandler();

app.use(webpackMiddleware)
    .use(headers)
    .use(bodyParser.urlencoded({ extended: true }))
    .use(staticFiles)
    .use(health);

// Start the server
app.listen(env.port, (err) => {
    const browser = `${env.protocol}://${env.domain}:${env.port}`;

    if (err) {
        return console.error(err);
    }

    console.info(
        colors.green('\n************************************************\n')
        + colors.yellow(`Starting server on ${browser} [${env.env}]`)
        + colors.green('\n************************************************\n')
    );

    /* Development Environments Only */
    if (env.testEnv) {
        openBrowser(browser);
    }

    return null;
});
