import { clean_dir } from './lib/fs';
//
// Cleans up the output (build) directory.
//
const clean = () => {
    return Promise.all([
        clean_dir('dist/*', {
            nosort: true,
            dot: true,
            ignore: ['dist/.git'],
        }),
    ]);
}
//
export default clean;
