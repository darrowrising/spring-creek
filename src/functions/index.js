import Express from 'express';
import colors from 'colors';
// import cors from 'cors';
import * as functions from 'firebase-functions';
import gateway from './gateway';
// firebase admin set up lives here
import './utils/firebase.utils';

const app = new Express();

// app.use(cors({ origin: true, }));
// routes
app.use(gateway);

console.info(
    colors.green('\n********************************************************\n')
    + colors.yellow(`   [${process.env.NODE_ENV || 'production'}] Server Running`)
    + colors.green('\n********************************************************\n')
);

module.exports.services = functions.https.onRequest(app);
