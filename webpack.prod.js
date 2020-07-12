const merge = require('webpack-merge');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = env => merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new MinifyPlugin()
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'API_BASE_URL': JSON.stringify('http://localhost:5000'),
            }
        })
    ],
});
