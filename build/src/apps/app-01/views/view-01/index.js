import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './view-01.css';

class View01 extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className={s.A-view-01}>
                Hello World
            </div>
        );
    }
}

export default withStyles(s)(View01);
