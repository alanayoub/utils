import fs from 'fs';
import path from 'path';
import glob from 'glob';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
//
export const read_file = (file) => new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => (err ? reject(err) : resolve(data)));
});
//
export const write_file = (file, contents) => new Promise((resolve, reject) => {
    fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
});
//
export const copy_file = (source, target) => new Promise((resolve, reject) => {
    let called = false;
    const done = error => {
        if (!called) {
            called = true;
            if (error) reject(err);
            else resolve();
        }
    }
    const rd = fs.createReadStream(source);
    rd.on('error', err => done(err));
    const wr = fs.createWriteStream(target);
    wr.on('error', err => done(err));
    wr.on('close', err => done(err));
    rd.pipe(wr);
});
//
export const read_dir = (pattern, options) => new Promise((resolve, reject) =>
    glob(pattern, options, (err, result) => (err ? reject(err) : resolve(result))),
);
//
export const make_dir = (name) => new Promise((resolve, reject) => {
    mkdirp(name, err => (err ? reject(err) : resolve()));
});
//
export const copy_dir = async (source, target) => {
    const dirs = await read_dir('**/*.*', {
       cwd: source,
       nosort: true,
       dot: true,
    });
    await Promise.all(dirs.map(async dir => {
        const from = path.resolve(source, dir);
        const to = path.resolve(target, dir);
        await make_dir(path.dirname(to));
        await copy_file(from, to);
    }));
};
//
export const clean_dir = (pattern, options) => new Promise((resolve, reject) =>
    rimraf(pattern, { glob: options }, (err, result) => (err ? reject(err) : resolve(result))),
);
