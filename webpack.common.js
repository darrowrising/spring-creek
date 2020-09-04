/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'production';
const devMode = env !== 'production';
// configs
const antdTheme = require('./src/server/utils/antThemeHandler');

module.exports = {
    entry: {
        main: path.resolve('./src/js/containers/App.js'),
        admin: path.resolve('./src/client/admin/index.js')
    },
    output: {
        path: path.resolve('public'),
        filename: 'static/[name].min.js',
        publicPath: '/',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                use: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.(styles.js|style.js|style.jsx)$/,
                use: 'stylelint-custom-processor-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|jpeg|gif|png|ico)$/,
                loader: 'file-loader?name=static/img/[name].[ext]',
                exclude: /node_modules/
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000&mimetype=application/font-woff&name=static/fonts/[name].[ext]',
                exclude: /node_modules/
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?name=static/fonts/[name].[ext]',
                exclude: /node_modules/
            },
            {
                test: /\.(less|css)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: { ...antdTheme.default },
                                javascriptEnabled: true,
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/[name].min.css'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src/index.hbs'),
            filename: 'index.html',
            favicon: path.resolve('src/images/springcreek_favicon.png'),
            excludeChunks: ['admin']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src/client/admin/index.hbs'),
            filename: 'admin/index.html',
            favicon: path.resolve('src/images/springcreek_favicon.png'),
            excludeChunks: ['main']
        })
    ],
    resolve: {
        alias: {
            variables: path.resolve('./src/less/variables.less'),
            theme$: path.resolve('./src/client/utils/themeHandler.utils.js')
        }
    }
};
