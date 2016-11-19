const HtmlWebpackPlugin = require('html-webpack-plugin');
//
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const prop = require('./properties.js');
//
const config = {};
//
// Generates entry config for each app
//
// entry: {
//     'app-01': `${prop.folder.apps}/app-01/${prop.root.filename}`
// },
//
const get_entry = () => {
    const entry  = {};
    const get_directories = directory => {
        const all_files = fs.readdirSync(directory);
        return all_files.filter(file => {
            file = path.join(directory, file);
            return fs.statSync(file).isDirectory();
        });
    };
    get_directories(prop.folder.apps).forEach(directory => {
        entry[directory] = `${prop.folder.apps}/${directory}/${prop.app.filename}`;
    });
    return entry;
};
config.entry = get_entry();
//
// Generates htmlWebpackPlugin array
//
const html_webpack_plugins = () => {
    const plugins = [];
    for (const app in config.entry) {
        plugins.push(new HtmlWebpackPlugin({
            filename: `${app}.index.html`,
            title: `${app}`,
            hash: false
        }));
    };
    return plugins;
};
//
module.exports = {
    context: prop.folder.root,
    entry: config.entry,
    output: {
        path: `${prop.folder.build}`,
        publicPath: '',
        filename: `[name].[chunkhash].${prop.app.filename_min}`,
        chunkFilename: '[chunkhash].js',
    },
    resolve: {
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        }),
        ...html_webpack_plugins()
    ]
};
