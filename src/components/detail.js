import React, {Component} from 'react';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
//import {fetchDetailCourse} from '../actions/course';
import {fetchLecture} from '../actions/lecture';

var david = [];
class Detail extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const course_no = localStorage.getItem('course');
        if(course_no) {
            //this.props.fetchDetailCourse(course_no);
            this.props.fetchLecture(course_no);

            this.props.history.push(`/detail/${course_no}`);
        }
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        //fetchDetailCourse: (course_no) => dispatch(fetchDetailCourse(course_no)),
        fetchLecture: (course_no) => dispatch(fetchLecture(course_no))
    }
};

export default Detail = withRouter(connect(null, mapDispatchToProps)(Detail));
