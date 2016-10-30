import 'babel-polyfill';
import $ from 'jquery';
import view01 from './views/view-01/index.js';
import view02 from './views/view-02/index.js';

$('<h1>View 01</h1>').appendTo('body');
const ul = $('<ul></ul>').appendTo('body');
for (const item of view01) {
    $('<li></li>').text(item).appendTo(ul);
};
