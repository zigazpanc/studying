import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {signError, Login} from '../actions';

import TextInput from '../components/text-input';
import centerComponent from 'react-center-component';

import Header from '../components/header';
import Footer from '../components/footer';

import {hostUrl} from '../config';

const $ = window.$;
class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            dialogStyle: {display: 'none'},
            isSubmitting: false
        };
    }

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext() {
        return {muiTheme: this.state.muiTheme};
    }

    static propTypes = {
        topOffset: PropTypes.number,
        leftOffset: PropTypes.number
    };

    componentDidMount() {
        this.setState({
            dialogStyle: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 0,
                marginRight: 0,
                width: '100%',
                height: '100%',
                top: this.props.topOffset,
                left: this.props.leftOffset
            }
        });
    }

    componentWillMount() {
        this.props.signError('');
    }

    submitForm = (e) => {
        e.preventDefault();

        const {isSubmitting} = this.state;

        if(isSubmitting) return;

        const {redirect} = this.props;
        const email = $('#email').val();
        const password = $('#password').val();

        if (email && password) {
            if (email.length > 0 && password.length > 0) {
                if(!isSubmitting) {
                    $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
                    this.setState({isSubmitting:true});
                }

                const failed = () => {
                    $('#submit').html('Submit');
                    this.setState({isSubmitting:false});
                };

                const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
                return sleep(300).then(() => {
                    this.props.Login({email, password, redirect, failed});
                });
            }
        }
    };

    signError = () => {
        if (this.props.error) {
            return (
                <div className="alert alert-danger">
                    <strong>{this.props.error}</strong>
                </div>
            );
        }
    };

    validateEmail = (value) => {
        let error = '';
        if (!value || value.length <= 0) {
            error = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Invalid email address';
        }

        return error;
    };

    validatePassword = (value) => {
        let error = '';
        if (!value || value.length <= 0) {
            error = 'Required';
        } else if (value.length < 4) {
            error = 'Must be 4 characters or more';
        } else if (value.length > 15) {
            error = 'Must be 15 characters or less';
        }

        return error;
    };

    reset = () => {
        this._email.reset();
        this._password.reset();
    };

    renderSocial = () => {
        return (
            <div style={{
                marginTop: 10,
            }}>
                <div style={{
                    marginBottom: 10,
                }}>
                    <a href={`${hostUrl}/auth/google`}>
                    <button
                        type="button"
                        name="google"
                        className="btn btn-lg btn-default"
                        style={{width:'310px'}}>
                        <i className="fa fa-google-plus social google"/>Login with Google+</button>
                </a>
                </div>
            </div>
        );
    };

    renderHeader = () => {
        if(!this.props.dialog) {
            return <Header/>;
        }
    };

    renderFooter = () => {
        if(!this.props.dialog) {
            return <Footer/>;
        }
    };

    render() {
        return (
            <div>
                {this.renderHeader()}
                <div style={{textAlign: 'center'}}>
                    {this.signError()}
                </div>
                <div style={this.state.dialogStyle}>
                    <form onSubmit={(e) => this.submitForm(e)}>
                        <TextInput
                            ref={e=>this._email = e}
                            label="Email"
                            name="email"
                            type="text"
                            validate={this.validateEmail}
                        />
                        <TextInput
                            ref={e=>this._password = e}
                            label="Password"
                            name="password"
                            type="password"
                            validate={this.validatePassword}
                            placeholder="Please enter a password"
                        />
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <button
                                id="submit"
                                type="submit"
                                value="Submit"
                                name="submit"
                                className="btn btn-lg btn-primary"
                                >Submit</button>
                            &nbsp;&nbsp;&nbsp;
                            <button
                                type="button"
                                value="Clear"
                                name="clear"
                                className="btn btn-lg btn-default"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.signError('');
                                    this.reset();
                                }}>Clear</button>
                            &nbsp;&nbsp;&nbsp;
                            <button
                                type="button"
                                value="Sign Up"
                                name="signup"
                                className="btn btn-lg btn-danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.history.push('/signup');
                                }}>Sign Up</button>
                        </div>
                    </form>
                </div>
                <div style={this.state.dialogStyle}>
                    {this.renderSocial()}
                </div>
                <div style={{marginBottom:40}}>&nbsp;</div>
                {this.renderFooter()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {error: state.auth.error};
}

const mapDispatchToProps = dispatch => {
    return {
        signError: (error) => dispatch(signError(error)),
        Login: ({email, password, redirect, failed}) => dispatch(Login({email, password, redirect, failed}))
    }
};

export default Signin = withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
