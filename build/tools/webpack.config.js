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
                  // CSS Loader https://github.com/webpack/css-loader
                  importLoaders: 1,
                  sourceMap: is_debug,
                  // CSS Modules https://github.com/css-modules/css-modules
                  modules: true,
                  localIdentName: is_debug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
                  // CSS Nano http://cssnano.co/options/
                  minimize: !is_debug,
                  discardComments: {removeAll: true},
                })}`,
                'postcss-loader?pack=default',
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
    ],
    // https://github.com/postcss/postcss
    postcss(bundler) {
        return {
            default: [
                // // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
                // // https://github.com/jonathantneal/postcss-partial-import
                // require('postcss-partial-import')({ addDependencyTo: bundler }),
                // // Allow you to fix url() according to postcss to and/or from options
                // // https://github.com/postcss/postcss-url
                // require('postcss-url')(),
                // // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
                // // https://github.com/postcss/postcss-custom-properties
                // require('postcss-custom-properties')(),
                // // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
                // // https://github.com/postcss/postcss-custom-media
                // require('postcss-custom-media')(),
                // // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
                // // https://github.com/postcss/postcss-media-minmax
                // require('postcss-media-minmax')(),
                // // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
                // // https://github.com/postcss/postcss-custom-selectors

                // require('postcss-custom-selectors')(),
                // W3C calc() function, e.g. div { height: calc(100px - 2em); }
                // https://github.com/postcss/postcss-calc
                require('postcss-calc')(),

                // // Allows you to nest one style rule inside another
                // // https://github.com/jonathantneal/postcss-nesting
                // require('postcss-nesting')(),
                // // Unwraps nested rules like how Sass does it
                // // https://github.com/postcss/postcss-nested
                // require('postcss-nested')(),
                // // W3C color() function, e.g. div { background: color(red alpha(90%)); }
                // // https://github.com/postcss/postcss-color-function
                // require('postcss-color-function')(),
                // // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
                // // https://github.com/iamvdo/pleeease-filters
                // require('pleeease-filters')(),
                // // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
                // // https://github.com/robwierzbowski/node-pixrem
                // require('pixrem')(),
                // // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
                // // https://github.com/postcss/postcss-selector-matches
                // require('postcss-selector-matches')(),
                // // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
                // // https://github.com/postcss/postcss-selector-not
                // require('postcss-selector-not')(),
                // // Postcss flexbox bug fixer
                // // https://github.com/luisrudge/postcss-flexbugs-fixes
                // require('postcss-flexbugs-fixes')(),
                // // Add vendor prefixes to CSS rules using values from caniuse.com
                // // https://github.com/postcss/autoprefixer
                // require('autoprefixer')({
                //     browsers: [
                //         '>1%',
                //         'last 4 versions',
                //         'Firefox ESR',
                //         'not ie < 9', // React doesn't support IE8 anyway
                //     ],
                // }),
            ],
        };
    }
};
