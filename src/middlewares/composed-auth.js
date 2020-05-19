import React, { Component } from 'react';

import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
    class ComposedAuth extends Component {
        componentWillMount() {
            if (!this.props.logged) {
                this.props.history.push('/');
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.logged) {
                this.props.history.push('/');
            }
        }

        render() {
            return <ComposedComponent {...this.props} />
        }
    }

    function mapStateToProps(state) {
        return {logged: state.auth.logged};
    }

    return withRouter(connect(mapStateToProps)(ComposedAuth));
}
