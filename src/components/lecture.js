import React, {Component} from 'react';

import {withRouter} from 'react-router-dom';

class Lecture extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const url = localStorage.getItem('url');
        if(url) {

            localStorage.removeItem('url');
            this.props.history.push(`/view-lecture/${url}`);
        }
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default Lecture = withRouter(Lecture);
