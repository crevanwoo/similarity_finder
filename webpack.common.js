const {
    join
} = require('path');
const webpack = require('webpack');

const PATHS = {
    source: join(__dirname, 'src'),
    index: join(__dirname, 'src', 'js', 'main.js'),
    build: join(__dirname, 'flaskapp', 'static')
};

module.exports = {

    devtool: 'cheap-module-source-map',

    entry: {
        index: PATHS.index,
    },

    output: {
        path: PATHS.build,
        publicPath: '/static/',
        filename: "bundle.js"
    },

    watch: process.argv.indexOf('--watch') !== -1,
    watchOptions: {
        aggregateTimeout: 100
    },
    module: {
        rules: [{
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss|.css$/,
                use: [{
                        loader: 'style-loader',

                    },
                    {
                        loader: 'css-loader',

                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    devServer: {
        inline: true,
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        contentBase: join(__dirname, 'flaskapp', 'templates'),
        open: true
    }
};
