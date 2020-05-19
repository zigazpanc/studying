import React, {Component} from 'react';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {signIn, userInfo} from '../actions';

class SocialGoogle extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        localStorage.setItem('token', parsed.token);

        this.props.signIn();
        this.props.userInfo();

        this.props.history.push('/');
    }

    render() {
        return <div/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signIn: () => dispatch(signIn()),
        userInfo: () => dispatch(userInfo())
    }
};

export default SocialGoogle = withRouter(connect(null, mapDispatchToProps)(SocialGoogle));
