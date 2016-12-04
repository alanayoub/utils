import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './views/app';

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss());
    return () => {
        removeCss.forEach(f => f());
    };
  },
};

require.ensure([
    './views/view-01/index.js',
], function (require) {

    const View01 = require('./views/view-01/index.js').default;

    const body = document.getElementsByTagName('body')[0];
    const container = document.createElement('div');
    container.setAttribute('class', 'A-App');
    body.insertBefore(container, body.firstChild);

    render(
        <App context={context}>
            <View01 context={context}/>
        </App>,
        container
    );

});
