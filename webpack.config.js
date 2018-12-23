// const path = require('path');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new OptimizeCSSAssetsPlugin()
    ]
});
