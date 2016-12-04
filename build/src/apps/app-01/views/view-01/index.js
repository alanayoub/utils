import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './view-01.css';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
};

class View01 extends React.Component {
    constructor() {
        super();
    }
    render(props, context) {
        return (
            <div className={s.A_view_01}>
                Hello World
            </div>
        );
    }
}

export default withStyles(s)(View01);
