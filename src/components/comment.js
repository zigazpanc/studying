import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Moment from 'react-moment';
import Rating from 'react-rating';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {resetComment, listComment, removeComment, toggleHelpful} from '../actions/comment';
import {userInfo} from '../actions';
import centerComponent from 'react-center-component';
import CircularProgress from 'material-ui/CircularProgress';

import AlertDialog from './alert-dialog';

import SignIn from '../auth/signin';

import '../styles/detail.css';

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

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            dialogStyle: {display: 'none'},
            open: false,
            course_no: 0,
            page: 1,
            limit: 4,
            remove_no: 0
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
                alignItems: 'center',
                marginTop: 100,
                marginBottom: 100,
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

        const course_no = localStorage.getItem('course');
        if(course_no) {
            this.setState({course_no});

            const {page,limit} = this.state;

            this.props.resetComment();

            setTimeout(() => {
                this.props.listComment(course_no, page, limit);
            }, 500);
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    showMore = () => {
        const {total} = this.props;
        const {course_no, limit} = this.state;

        let _page = this.state.page + 1;
        if(_page >= total) {
            _page = total;
        }
        this.setState({page:_page});

        this.props.listComment(course_no, _page, limit);
    };

    commentRemove = (comment) => {
        if (this.props.logged) {
            if(this._alert) {
                this.setState({remove_no:comment.no});
                this._alert.handleOpen();
            }
        }
        else {
            this.handleOpen();
        }
    };

    deleteComment = () => {
        const {course_no,page,limit,remove_no} = this.state;

        this.props.removeComment(course_no, page, limit, remove_no);
    };

    toggleHelpful = (comment) => {
        if (this.props.logged) {
            const {course_no,page,limit} = this.state;

            this.props.toggleHelpful(course_no, page, limit, comment.no);
        }
        else {
            this.handleOpen();
        }
    };

    reviewComment = () => {
        if (this.props.logged) {
            this.props.history.push('/review-comment');
        }
        else {
            this.handleOpen();
        }
    };

    renderState = () => {
        if (this.props.hasError) {
            return (
                <div className="alert alert-danger">
                    <div style={{textAlign: 'center'}}>
                        <strong>There was a loading error</strong>
                    </div>
                </div>
            );
        }

        if (this.props.isLoading) {
            return (
                <div style={this.state.dialogStyle}>
                    <CircularProgress size={60} thickness={7}/>
                </div>);
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

    commentAdd = () => {
        return (
            <div>
<span>
                                            <FlatButton
                                                primary={true}
                                                label="Rate the Course"
                                                labelStyle={{fontSize: '1.4rem'}}
                                                onTouchTap={() => {
                                                    this.reviewComment()}}/>
                                        </span>
            </div>
        );
    };

    commentPicture = (comment) => {
        if(comment._user) {
            return (
                <img src={`${_.get(comment, '_user.profile.picture')}`} width="70px" height="70px" alt="" className="img-circle" style={{marginLeft:0,marginRight:0, verticalAlign:'middle'}}/>
            );
        }
    };

    commentDate = (comment) => {
        if(comment._user) {
            return (
                <p className="text-size-fifth">
                    <Moment fromNow ago>{comment.date}</Moment> ago</p>
            );
        }
    };

    commentName = (comment) => {
        if(comment._user) {
            return (
                <p className="text-size-fifth">{_.get(comment, '_user.profile.name')}</p>
            );
        }
    };

    commentContent = (comment) => {
        if(comment._user) {
            return (
                <div>
                    <p className="text-size-fifth text-bold" dangerouslySetInnerHTML={ {__html: comment.content} }/>
                </div>
            );
        }
    };

    commentReplyDate = (comment) => {
        if(comment._reply) {
            return (
                <p className="text-size-fifth">
                    <Moment fromNow ago>{_.get(comment, '_reply.date')}</Moment> ago</p>
            );
        }
    };

    commentReplyName = (comment) => {
        if(comment._reply) {
            if(_.get(comment, '_reply.name')) {
                return (
                    <p className="text-size-fifth text-bold" style={{marginBottom:20}}>{_.get(comment, '_reply.name')} (Instructor)</p>
                );
            }
        }
    };

    commentReplyContent = (comment) => {
        if(comment._reply) {
            return (
                <p className="text-size-fifth text-bold" dangerouslySetInnerHTML={ {__html:
_.get(comment, '_reply.content')} }/>
            );
        }
    };

    commentReply = (comment) => {
        if(comment._reply) {
            return (
                <div style={{marginBottom:20, paddingLeft:20, paddingRight:20,paddingTop:14, paddingBottom:14, backgroundColor: '#EEE', borderRadius:16}}>
                    {this.commentReplyDate(comment)}
                    {this.commentReplyName(comment)}
                    {this.commentReplyContent(comment)}
                    {this.commentMark(comment._reply)}
                </div>
            );
        }
    };

    commentMark = (comment) => {
        return (
            <div>
                <span className="text-size-third">Mark as:   </span>
                <span>
                                            <FlatButton
                                                primary={comment.helpful}
                                                label="Helpful"
                                                labelStyle={{fontSize:'1.4rem'}}
                                                onTouchTap={() => {
                                                    this.toggleHelpful(comment)}}/>
                                        </span>
                <span>
                                            <FlatButton label="Delete"
                                                        labelStyle={{fontSize:'1.4rem'}}
                                                        onTouchTap={() => {this.commentRemove(comment)}}/>

                                        </span>
            </div>
        );
    };

    listComment = (comment) => {
        return (
            <div>
                <br/>
                <Paper zDepth={1} style={{
                    width: '100%',
                    height: '100%',
                    marginBottom: 10,
                    overflow: 'hidden',
                    backgroundColor: '#FFF',
                    display: 'block'
                }}>
                    <div className="container-fluid">
                        <div className="row" style={{marginTop:20}}>
                            <div className="col-sm-5">
                                <div style={{marginLeft: 3, marginRight: 3, marginTop: 8, marginBottom: 8, overflow: 'hidden'}}>
                                    <div className="row">
                                        <div className="col-xs-4">
                                            {this.commentPicture(comment)}
                                        </div>
                                        <div className="col-xs-8">
                                            {this.commentDate(comment)}
                                            {this.commentName(comment)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div style={{textAlign: 'center'}}>
                                    <Rating
                                        placeholderRate={comment.rating}
                                        fractions={2}
                                        readonly={true}
                                        empty={<img src={`/public/assets/images/star-grey.png`} className="icon" />}
                                        placeholder={<img src={`/public/assets/images/star-yellow.png`} className="icon" />}
                                        full={<img src={`/public/assets/images/star-yellow.png`} className="icon" />}
                                    />
                                </div>
                                <div style={{marginLeft:10, marginRight:10,marginTop:12, marginBottom:12}}>
                                    {this.commentContent(comment)}
                                    {this.commentMark(comment)}
                                    <br/>
                                    {this.commentReply(comment)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                </Paper>
            </div>
        );
    };

    renderList = () => {
        const {comments} = this.props;
        const {page,limit} = this.state;

        if (!comments) return (<div>&nbsp;</div>);
        if(page <= 0 || limit <= 0) return (<div>&nbsp;</div>);

        return _.map(comments, (comment, i) => {
            return (
                <div key={i}>
                    {this.listComment(comment)}
                </div>
            );
        })
    };

    renderMore = () => {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop:15, marginBottom:15}}>
                <button
                    type="button"
                    name="showmore"
                    className="btn btn-lg btn-danger btn-block"
                    onClick={(e) => {
                        e.preventDefault();
                        this.showMore();
                    }}>Show More</button>
            </div>
        );
    };

    render() {
        if(this.props.isLoading) {
            return (
                <div>
                    {this.renderState()}
                </div>
            );
        }

        return (
            <div>
                <div>
                </div>
                <AlertDialog
                    ref={(e) => this._alert = e}
                    message="Are you sure ?"
                    handleConfirm={this.deleteComment}/>
                {this.renderDialog()}
                {this.commentAdd()}
                {this.renderList()}
                {this.renderMore()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged: state.auth.logged,
        user: state.auth.user,
        hasError: state.fetchCommentError,
        isLoading: state.fetchCommentLoading,
        comments: state.fetchCommentList.comments,
        total: state.fetchCommentList.total
    };
}

const mapDispatchToProps = dispatch => {
    return {
        resetComment: () => dispatch(resetComment()),
        listComment: (course_no,page,limit) => dispatch(listComment(course_no,page,limit)),
        removeComment: (course_no,page,limit,comment_no) => dispatch(removeComment(course_no,page,limit,comment_no)),
        toggleHelpful: (course_no,page,limit,comment_no) => dispatch(toggleHelpful(course_no,page,limit,comment_no)),
        userInfo: () => dispatch(userInfo())
    }
};

export default Comment = withRouter(connect(mapStateToProps, mapDispatchToProps)(Comment));
