import 'babel-polyfill';
require.ensure([
    './views/view-01/index.js',
], function (require) { // Arrow functions webpack issue 3315
    const view01 = require('./views/view-01/index.js');
    //
    document.getElementsByTagName('body')[0].innerHTML += '<h1>App 02 / View 01</h1>';
});
