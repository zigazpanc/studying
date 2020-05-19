import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

import {withRouter} from 'react-router-dom';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {muiTheme: getMuiTheme()};
    }

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext() {
        return {muiTheme: this.state.muiTheme};
    }

    handleLink = () => {
        return (
            <div>
                <RaisedButton
                    label="Copyright ©"
                    onTouchTap={() => {
                        this.props.history.push('/welcome');
                    }}
                />
            </div>
        );
    };

    render() {
        return (
            <div>
                <div>
                    {this.handleLink()}
                </div>
            </div>
        );
    }
}

export default Footer = withRouter(Footer);
