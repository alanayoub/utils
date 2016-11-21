import webpack from 'webpack';
import webpack_config from './webpack.config';
import run from './run';
import clean from './clean';
//
const start = async () => {
    await run(clean);
    await new Promise(resolve => {
        const compiler = webpack(webpack_config);
        compiler.run((error, stats) => {
            resolve();
        });
    });
}
//
export default start;
