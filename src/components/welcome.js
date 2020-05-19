import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {connect} from 'react-redux';
import {fetchMessage} from '../actions';

import Header from './header';
import Footer from './footer';

class Welcome extends Component {
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

    componentWillMount() {
        this.props.fetchMessage();
    }

    render() {
        return (
            <div>
                <Header/>
                <div>{this.props.message}</div>
                <Footer/>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {message: state.auth.message};
}

const mapDispatchToProps = dispatch => {
    return {
        fetchMessage: () => dispatch(fetchMessage())
    }
};

export default Welcome = connect(mapStateToProps, mapDispatchToProps)(Welcome);
