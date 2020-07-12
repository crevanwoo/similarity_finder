const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const {
    join
} = require('path');

module.exports = env => merge(common, {
    mode: 'development',
    module: {
        rules: [{
            enforce: "pre",
            test: /\.(js|jsx)$/,
            include: join(__dirname, 'src', 'js'),
            exclude: /node_modules/,
            use: [{
                loader: "eslint-loader",
                options: {
                    fix: true,
                    quiet: true,
                }
            }]
        }, ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'API_BASE_URL': JSON.stringify('http://localhost:5000'),
            }
        })
    ],
});
