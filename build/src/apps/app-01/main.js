import 'babel-polyfill';
require.ensure([
    './views/view-01/index.js',
    './views/view-02/index.js'
], function (require) { // Arrow functions webpack issue 3315
    const view01 = require('./views/view-01/index.js');
    const view02 = require('./views/view-02/index.js');
    //
    document.getElementsByTagName('body')[0].innerHTML += '<h1>View 01</h1>';
});
