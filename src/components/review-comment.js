import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Rating from 'react-rating';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {commentError, addComment} from '../actions/comment';
import {userInfo} from '../actions';

import Header from './header';
import Footer from './footer';

import SignIn from '../auth/signin';

import '../styles/detail.css';

const $ = window.$;

const styles = {
    dialogRoot: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 0
    },
    dialogContent: {
        position: "relative",
        width: "80vw",
        transform: "",
    },
    dialogBody: {
        paddingBottom: 0
    }
};

class ReviewComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            dialogStyle: {display: 'none'},
            isSubmitting: false,
            open: false,
            rating: 0
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
                marginTop: 40,
                marginBottom: 40,
                marginLeft: 0,
                marginRight: 0,
                width: '100%',
                height: '100%',
                top: this.props.topOffset,
                left: this.props.leftOffset
            }
        });

        const token = localStorage.getItem('token');
        if(token) {
            this.props.userInfo();
        }
    }

    componentWillMount() {
        this.props.commentError('');
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    onRatingClick = (rate, event) => {
        this.setState({rating: rate});
    };

    submitForm = (values) => {
        if (this.props.logged) {
            const {isSubmitting} = this.state;

            if(isSubmitting) return;

            const {rating} = this.state;
            const {content} = values;

            if (rating && content) {
                if(!isSubmitting) {
                    $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
                    this.setState({isSubmitting:true});
                }

                const failed = () => {
                    $('#submit').html('Submit');
                    this.setState({isSubmitting:false});
                };

                const course_no = localStorage.getItem('course');
                if (course_no) {
                    const page = 1;
                    const limit = 4;
                    const helpful = false;

                    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
                    return sleep(300).then(() => {
                        this.props.addComment(course_no, page, limit, content, rating, helpful, failed);
                    });
                }
            }
        }
        else {
            this.handleOpen();
        }
    };

    renderTextField = ({input, label, type, placeholder, multiLine, meta: {touched, error}, ...custom}) => (
        <div className="form-group">
            <div className="row">
                <label htmlFor={input.name} className="col-lg-2 control-label">{label}</label>
                <div className="col-lg-10">
                    <textarea {...input} {...custom} id={input.name} type= {type} className="form-control" rows="3" placeholder={placeholder}/>
                    <p className="help-block">{touched && error}</p>
                </div>
            </div>
        </div>
    );

    commentError = () => {
        if (this.props.error) {
            return (
                <div className="alert alert-danger">
                    <strong>{this.props.error}</strong>
                </div>
            );
        }
    };

    renderDialog = () => {
        return (
            <div>
                <Dialog
                    contentStyle={ styles.dialogContent }
                    bodyStyle={ styles.dialogBody }
                    style={ styles.dialogRoot }
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    repositionOnUpdate={false}
                    autoScrollBodyContent={true}
                >
                    <SignIn redirect={this.handleClose} dialog={true}/>
                    <br/>
                    <br/>
                </Dialog>
            </div>
        );
    };

    renderRating = () => {
        const {rating} = this.state;

        return (
            <div>
                <div style={{textAlign: 'center', marginTop:30}}>
                    <Rating
                        ref={(e) => this._rating = e}
                        fractions={2}
                        placeholderRate={rating}
                        readonly={false}
                        empty={<img src={`/public/assets/images/star-grey.png`} className="icon" />}
                        placeholder={<img src={`/public/assets/images/star-yellow.png`} className="icon" />}
                        full={<img src={`/public/assets/images/star-yellow.png`} className="icon" />}
                        onClick={this.onRatingClick}
                    />
                </div>
            </div>
        );
    };

    renderForm = () => {
        const {handleSubmit, pristine, reset, submitting} = this.props;

        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    {this.commentError()}
                </div>
                <div style={this.state.dialogStyle}>
                    <form onSubmit={handleSubmit(this.submitForm)} noValidate autoComplete="off">
                        <div style={{width:'300px'}}>
                            <Field
                                name="content"
                                type="text"
                                component={this.renderTextField}
                                label="Review"
                                placeholder="You can use multiline."
                                multiLine={true}
                            />
                        </div>
                        <div>&nbsp;</div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <button
                                id="submit"
                                type="submit"
                                value="Submit"
                                name="submit"
                                className="btn btn-lg btn-primary"
                                disabled={submitting}
                            >Submit</button>
                            &nbsp;&nbsp;&nbsp;
                            <button
                                type="button"
                                value="Clear"
                                name="clear"
                                className="btn btn-lg btn-default"
                                disabled={pristine || submitting}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.commentError('');
                                    reset();
                                }}>Clear</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div>
                <div>
                    {this.renderDialog()}
                </div>
                <div>
                    <Header/>
                    <br/>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <Paper zDepth={1} style={{
                                    width: '100%',
                                    height: '100%',
                                    marginTop: 40,
                                    marginBottom: 40,
                                    overflow: 'hidden',
                                    backgroundColor: '#FFF',
                                    display: 'block'
                                }}>
                                    <br/>
                                    <div className="text-size-second text-bold" style={{textAlign: 'center'}}>Share your opinion about the quality of this course.</div>
                                    <br/>
                                    {this.renderRating()}
                                    {this.renderForm()}
                                </Paper>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export const validate = values => {
    const errors = {};

    if (!values.content) {
        errors.content = 'Required';
    } else if (values.content.length < 10) {
        errors.content = 'Must be 10 characters or more';
    }

    return errors;
};

function mapStateToProps(state) {
    return {
        logged: state.auth.logged,
        user: state.auth.user,
        hasError: state.fetchCommentError,
        isLoading: state.fetchCommentLoading
    };
}

const form = reduxForm({
    form: 'review',
    validate
});

const mapDispatchToProps = dispatch => {
    return {
        commentError: (error) => dispatch(commentError(error)),
        addComment: (course_no,page,limit,content,rating,helpful, failed) => dispatch(addComment(course_no,page,limit,content,rating,helpful, failed)),
        userInfo: () => dispatch(userInfo())
    }
};

export default ReviewComment = withRouter(form(connect(mapStateToProps, mapDispatchToProps)(ReviewComment)));
