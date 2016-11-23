const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const prop = require('./properties.js');

const is_debug = !process.argv.includes('--release');
const is_verbose = process.argv.includes('--verbose');

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
// @see https://github.com/ampedandwired/html-webpack-plugin
//
const html_webpack_plugins = () => {
    const plugins = [];
    for (const app in config.entry) {
        const path = `src/apps/${app}/index.html`;
        const config = {
            inject: false,
            filename: `${app}.index.html`,
            title: `${app}`,
            hash: false,
            chunks: [app]
        };
        // Use a custom template if one exists
        // else use the default
        try {
            fs.accessSync(path, fs.F_OK);
            config.template = path;
        } catch (error) {
            config.template = `src/common/app-x/index.html`;
        }
        plugins.push(new HtmlWebpackPlugin(config));
    };
    return plugins;
};

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
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                babelrc: false,
                presets: [
                    'latest',
                    'stage-0',
                    'react',
                ]
            }
        },
        {
            test: /\.css/,
            loaders: [
                'isomorphic-style-loader',
                `css-loader?${JSON.stringify({
                    importLoaders: 1,
                    sourceMap: is_debug,
                    // CSS Modules https://github.com/css-modules/css-modules
                    modules: true,
                    localIdentName: is_debug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
                    // CSS Nano http://cssnano.co/options/
                    minimize: !is_debug,
                })}`,
                'postcss-loader?pack=default',
          ],
        },
        {
            test: /\.scss/,
            loaders: [
                'isomorphic-style-loader',
                `css-loader?${JSON.stringify({sourceMap: is_debug, minimize: !is_debug})}`,
                'postcss-loader?pack=sass',
                'sass-loader',
            ],
        }]
    },
    plugins: [
        ...is_debug
            ? []
            : new webpack.optimize.UglifyJsPlugin({
                compress: {
                    screw_ie8: true,
                    warnings: is_verbose
                },
                output: {comments: is_verbose}
            }),
        ...html_webpack_plugins(),
    ]
};
