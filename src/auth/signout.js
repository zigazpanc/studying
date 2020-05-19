import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Logout} from '../actions';

import Header from '../components/header';
import Footer from '../components/footer';

const style = {
    height: '40%',
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center',
    verticalAlign: 'middle !important',
    display: 'inline-block'
};

class Signout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            showLogin: false
        };
    }

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext() {
        return {muiTheme: this.state.muiTheme};
    }

    componentWillMount() {
        this.props.Logout();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({showLogin: true});
        }, 1500);
    }

    renderLogin = () => {
        if(!this.props.logged) {
            if (this.state.showLogin) {
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: 10
                    }}>
                        <button
                            type="button"
                            name="login"
                            className="btn btn-lg btn-danger"
                            onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push('/signin');
                            }}>Log back in here.
                        </button>
                    </div>
                );
            }
        }
    };

    render() {
        return (
            <div>
                <Header/>
                <div style={{textAlign: 'center'}}>
                    <Paper style={style} zDepth={5}>
                        <div style={{
                            margin: 20,
                            textAlign: 'center !important',
                            verticalAlign: 'middle !important',
                            display: 'inline-block'
                        }}>
                            <br/>
                            <p>Thank you for visiting iStudy!</p>
                            <p>You've successfully logged out of your account.</p>
                            <br/>
                        </div>
                        <div>
                            {this.renderLogin()}
                            <p>&nbsp;</p>
                        </div>
                    </Paper>
                </div>
                <Footer/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged: state.auth.logged
    }
}

const mapDispatchToProps = dispatch => {
    return {
        Logout: () => dispatch(Logout())
    }
};

export default Signout = withRouter(connect(mapStateToProps, mapDispatchToProps)(Signout));
