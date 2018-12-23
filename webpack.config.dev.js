const merge = require('webpack-merge');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const path = require('path');

const common = require('./webpack.common.js');
const env = require('./server/utils/env');

module.exports = merge(common, {
    devtool: 'inline-sourcemap',
    entry: [
        'webpack/hot/dev-server',
        `webpack-hot-middleware/client?reload=true&path=http://localhost:${env().port}/__webpack_hmr`
    ],
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
