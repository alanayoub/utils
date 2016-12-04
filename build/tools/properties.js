const local_props = require('./properties.local.js');
const props = {
    folder: {
        root: `${__dirname}/..`,
        build: `/dist`,
        apps: './src/apps'
    },
    app: {
        filename: 'main.js',
        filename_min: 'main.min.js'
    }
};
if (local_props) props = Object.assign(props, local_props);
module.exports = props;
