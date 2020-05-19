import _ from 'lodash';
import dateFormat from 'dateformat';
import {hostUrl} from '../config';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
//import {fetchDetailCourse} from '../actions/course';
import CircularProgress from 'material-ui/CircularProgress';

import ShowMore from 'react-show-more';

import Header from './header';
import Footer from './footer';
import CartBanner from './cart-banner';
import Curriculum from './curriculum';
import Comment from './comment';

import '../styles/detail.css';

const numberWithCommas = (x) => {
    let parts = parseInt(x).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

class DetailCourse extends Component {
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

        window.scrollTo(0, 0);

        this.props.fetchDetailCourse(this.props.match.params.id);
    }

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

    authorNames = (authors) => {
        return _.map(authors, (author, i) => {
            let decorator = ', ';
            if(i === authors.length-1) {
                decorator = '';
            }

            return (
                <span key={i}>
                    <a className="text-emphasis-first" href="">{author.name}</a><a className="text-white" href="">{decorator}</a>
                </span>
            );
        });
    };

    renderAuthor = (authors) => {
        return _.map(authors, (author, i) => {
            let decorator = '<br/>';
            if(i === authors.length-1) {
                decorator = '';
            }

            return (
                <div key={i}>
                    <div className="row">
                        <div className="col-sm-1"/>
                        <div className="col-sm-4">
                            <div><img src={`${hostUrl}/images/${author.avatar}`} alt=""/></div>
                            <br/>
                            <div><span className="text-size-third text-bold">{author.average}</span> <span className="text-size-fourth">Average rating</span></div>
                            <div><i className="fa fa-home text-emphasis-second"/><span className="text-size-third text-bold">{numberWithCommas(author.reviews)}</span> <span className="text-size-fourth">Reviews</span></div>
                            <div><span className="text-size-third text-bold">{numberWithCommas(author.students)}</span> <span className="text-size-fourth">Students</span></div>
                            <div><span className="text-size-third text-bold">{numberWithCommas(author.courses)}</span> <span className="text-size-fourth">Courses</span></div>
                            <br/>
                        </div>
                        <div className="col-sm-6">
                            <div className="text-size-fifth text-emphasis-fourth text-bold">{author.name}</div>
                            <div className="text-size-sixth">
                                <ShowMore
                                    lines={5}
                                    more='Show more'
                                    less='Show less'
                                    anchorClass=''
                                >
                                    <div dangerouslySetInnerHTML={ {__html: unescape(author.description)} }/>
                                </ShowMore>
                            </div>
                        </div>
                        <div className="col-sm-1"/>
                    </div>
                    <div className="row">
                        <div className="text-white">{decorator}</div>
                    </div>
                </div>
            );
        });
    };

    renderCourse = () => {
        const {course} = this.props;

        if (!course) return (<div>&nbsp;</div>);

        return (
            <div className="container-fluid">
                <div className="row header-top">
                    <div className="col-sm-12">
                        <div className="container">
                            <div className="row body-content">
                                <div className="col-sm-8">
                                    <br/>
                                    <br/>
                                    <div className="text-white text-size-first">{course.title}</div>
                                    <br/>
                                    <div className="text-white text-size-second">{course.subtitle}</div>
                                    <div className="text-white text-size-third">rating: <span
                                        className="text-emphasis-first">{course.average}</span> (<span
                                        className="text-emphasis-second">{numberWithCommas(course.reviews)}</span> reviews)
                                    </div>
                                    <div className="text-white text-size-third text"><span
                                        className="text-emphasis-third">{numberWithCommas(course.enrolled)}</span> students enrolled
                                    </div>
                                    <div className="text-white text-size-third text">Created
                                        by {this.authorNames(course._authors)}</div>
                                    <div className="text-white text-size-third text">Last updated <span
                                        className="text-emphasis-third">{dateFormat(course.updated, "m/yyyy")}</span>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div style={{marginTop:30}} className="hidden-xs">
                                    </div>
                                    <br/>
                                    <CartBanner course={course}/>
                                </div>
                            </div>
                            <div className="row body-content hidden-xs">
                                <div className="col-sm-12">
                                    <br/>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
                <div className="container">
                    <div className="row body-content">
                        <div className="col-sm-offset-1 col-sm-10">
                            <br/>
                            <br/>
                            <div className="text-size-second text-bold">Description</div>
                            <br/>
                            <ShowMore
                                lines={5}
                                more='Show more'
                                less='Show less'
                                anchorClass=''
                            >
                                <div dangerouslySetInnerHTML={ {__html: unescape(course.description)} }/>
                            </ShowMore>
                            <br/>
                            <br/>
                            <Curriculum/>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row body-content">
                        <div className="col-sm-offset-1 col-sm-10">
                            <br/>
                            <br/>
                            <div className="text-size-second text-bold text-center">About the Instructor</div>
                        </div>
                    </div>
                    <br/>
                </div>
                <div className="container">
                    {this.renderAuthor(course._authors)}
                    <br/>
                </div>
                <br/>
                <div className="container">
                    <Comment/>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div>
                <Header {...this.props}/>
                <div>
                    {this.renderState()}
                </div>
                <div style={{
                    marginTop: 20,
                    marginBottom: 20
                }}>
                    {this.renderCourse()}
                </div>
                <Footer {...this.props}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        course: state.fetchDetailCourseDone,
        hasError: state.fetchCourseFailure,
        isLoading: state.fetchCourseLoading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        //fetchDetailCourse: (course_no) => dispatch(fetchDetailCourse(course_no))
    }
};

export default DetailCourse = withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailCourse));
