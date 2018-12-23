/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../../webpack.config.dev';

const app = express();

if (process.env.NODE_ENV !== 'production') {
    const compiler = webpack(config);
    compiler.apply(new webpack.ProgressPlugin());
    const instance = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        noInfo: false,
        logTime: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        quiet: false,
        reload: true,
        watchOptions: {
            ignored: ['node_modules']
        },
        stats: {
            assets: true,
            children: false,
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            colors: true,
            errors: true,
            errorDetails: true,
            hash: false,
            maxModules: 0,
            modules: false,
            performance: true,
            timings: true,
            version: false,
            warnings: true,
        }
    });

    app.use(instance);
    app.use(webpackHotMiddleware(compiler));
}

export default app;
