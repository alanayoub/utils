const format = time => {
    return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
//
const run = (fn, options) => {
    const task = typeof(fn.default) === 'undefined' ? fn : fn.default;
    const start = new Date();
    console.log(
        `[${format(start)}] Starting '${task.name}${options ? ` (${options})` : ''}'...`,
    );
    return task(options).then(resolution => {
        const end = new Date();
        const time = end.getTime() - start.getTime();
        console.log(
            `[${format(end)}] Finished '${task.name}${options ? ` (${options})` : ''}' after ${time} ms`,
        );
        return resolution;
    });
}
// If called directly, i.e. not via require
if (require.main === module && process.argv.length > 2) {
    delete require.cache[__filename];                          // eslint-disable-line no-underscore-dangle
    const module = require(`./${process.argv[2]}.js`).default; // eslint-disable-line import/no-dynamic-require
    run(module).catch(error => {
        console.error(error.stack);
        process.exit(1);
    });
}
//
export default run;
