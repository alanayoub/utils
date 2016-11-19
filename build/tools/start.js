import webpack from 'webpack';
import webpack_config from './webpack.config';
//
const start = async () => {
    await new Promise(resolve => {
        const compiler = webpack(webpack_config);
        compiler.run((error, stats) => {
            resolve();
        });
    });
}
//
export default start;
