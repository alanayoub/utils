import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

require.ensure([
    './views/view-01/index.js',
], function (require) {
    const View01 = require('./views/view-01/index.js').default;

    const body = document.getElementsByTagName('body')[0];
    const container = document.createElement('div');
    container.setAttribute('class', 'A-App');
    body.insertBefore(container, body.firstChild);

    render(<View01/>, container);
});
