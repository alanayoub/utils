const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const prop = require('./properties.js');
//
// Get array of child directories
//
const get_directories = directory => {
    const all_files = fs.readdirSync(directory);
    return all_files.filter(file => {
        file = path.join(directory, file);
        return fs.statSync(file).isDirectory();
    });
};
//
const config = {};
//
// Generates entry config for each app
//
// entry: {
//     'app-01': `${prop.folder.apps}/app-01/${prop.root.filename}`
// },
//
config.entry = {};
get_directories(prop.folder.apps).forEach(directory => {
    config.entry[directory] = `${prop.folder.apps}/${directory}/${prop.app.filename}`;
});
//
module.exports = {
    context: prop.folder.root,
    entry: config.entry,
    output: {
        path: prop.folder.build,
        filename: `[name]${prop.app.filename_min}`
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
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            }
        })
    ]
};
