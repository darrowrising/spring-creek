/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'production';
const devMode = env !== 'production';

module.exports = {
    entry: [
        '@babel/polyfill', './src/js/containers/App.js'
    ],
    output: {
        path: path.resolve('public'),
        filename: 'static/main.min.js',
        publicPath: '/'
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
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/,
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
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
                exclude: /node_modules(?!\/react-calendar)/
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/main.min.css'
        }),
        new StyleLintPlugin({
            context: 'src',
            files: ['**/*.less', 'less/**/*.less'],
            syntax: 'less'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('src/index.hbs'),
            fileName: 'static/index.html',
            favicon: path.resolve('src/images/springcreek_favicon.png'),
            reactFileName: devMode ? env : `${env}.min`
        })
    ],
    resolve: {
        alias: {
            variables: path.resolve('./src/less/variables.less')
        }
    }
};
