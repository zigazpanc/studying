import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchViewCourses} from '../actions/view-courses';
import {userInfo} from '../actions';
import CircularProgress from 'material-ui/CircularProgress';
import Equalizer from 'react-equalizer';

import {hostUrl} from '../config';

import Header from './header';
import Footer from './footer';

import '../styles/detail.css';


class ViewCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            dialogStyle: {display: 'none'}
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
        if (token) {
            this.props.userInfo();
        }

        this.props.fetchViewCourses();
    }

    handleCourse = (event, course) => {
        event.preventDefault();

        localStorage.setItem('course', course.no);
        this.props.history.push('/detail');
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

    renderTop = () => {
        const {courses} = this.props;

        if(courses) {
            return (
                <div style={{width: '100%', backgroundColor: 'rgba(33, 33, 33, 0.9)'}}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12">
                                <br/>
                                <div className="text-size-second text-bold text-white">
                                    <span>My Courses</span>
                                </div>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    authorNames = (authors) => {
        return _.map(authors, (author, i) => {
            return (
                <div key={i} style={{marginBottom:6}}>
                    <span>
                        <Avatar src={`${hostUrl}/images/${author.avatar}`} size={22}/>
                    </span>
                    <span> {author.name}</span>
                </div>
            );
        });
    };

    listCourse = (course) => {
        return (
            <div onClick={(e) => this.handleCourse(e, course)} style={{
                width: '100%',
                height: '100%',
                cursor:"pointer"
            }}>
                <Paper zDepth={1} style={{
                    width: '100%',
                    height: '100%',
                    padding: 10,
                    margin: 10,
                    backgroundColor: '#FFF'
                }}>
                    <div
                        style={{marginLeft: 3, marginRight: 3, marginTop: 12, marginBottom: 8, overflow: 'hidden'}}>
                        <img alt="img" style={{width: '100%', height: '100%'}} src={`${hostUrl}/images/${course.picture}`}/>
                    </div>
                    <hr/>
                    <div className="text-size-fifth">
                        {this.authorNames(course._authors)}
                    </div>
                    <hr/>
                    <div className="text-size-fifth text-bold">{course.title}</div>
                    <div className="text-size-fifth">{course.subtitle}</div>
                </Paper>
            </div>
        );
    };

    listCourses = (lists) => {
        return _.map(lists, (course, i) => {
            return (
                <div key={i} className="col-sm-4">
                    {this.listCourse(course)}
                </div>
            );
        })
    };

    renderList = () => {
        const {courses} = this.props;

        if(courses) {
            if(courses.length <= 0) {
                return (
                    <div className="text-size-second text-bold text-center" style={{marginTop: 140, marginBottom: 140}}>
                        There is no course right now.
                    </div>
                );
            }

            const rows =_.map(courses, (course, i) => {
                if ((i % 3) === 0) {
                    const lists = _.slice(courses, i, i+3);
                    return (
                            <div key={i} className="row" style={{marginBottom:20}}>
                                <Equalizer byRow={true}>
                                    {this.listCourses(lists)}
                                </Equalizer>
                            </div>
                    );
                }
            });

            return (
                <div>
                    <br/>
                        <div>
                            {rows}
                        </div>
                    <br/>
                </div>
            );
        }
    };

    renderCourses = () => {
        if(this.props.isLoading) {
            return (
                <div>
                    {this.renderState()}
                </div>
            );
        }

        return (
            <div>
                {this.renderTop()}
                {this.renderList()}
            </div>
        );
    };

    render() {
        return (
            <div>
                <Header/>
                {this.renderCourses()}
                <Footer/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged: state.auth.logged,
        user: state.auth.user,
        hasError: state.viewCoursesError,
        isLoading: state.viewCoursesLoading,
        courses: state.fetchViewCourses
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchViewCourses: () => dispatch(fetchViewCourses()),
        userInfo: () => dispatch(userInfo())
    }
};

export default ViewCourses = withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewCourses));
