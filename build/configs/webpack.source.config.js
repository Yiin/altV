const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        server: './src/server/index.ts',
        client: './src/client/index.ts',
    },
    output: {
        path: path.resolve('./resources/gamemode'),
        filename: '[name].mjs',
    },
    externals: [
        nodeExternals({
            whitelist: /[^typeorm]/,
        }),
    ],
    resolve: {
        alias: {
            '~': path.resolve('src'),
            Shared: path.resolve('src/shared'),
        },
        extensions: ['.ts', '.js', '.md'],
    },
    optimization: {
        minimize: false,
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    { loader: 'raw-loader' },
                    { loader: 'markdown-loader' },
                ],
            },
            {
                test: /\.ts$/,
                loader: 'babel-loader',
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
        ],
    },
};
