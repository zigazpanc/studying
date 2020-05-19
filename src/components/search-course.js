import _ from 'lodash';

import dateFormat from 'dateformat';
import {hostUrl} from '../config';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {signError} from '../actions';
//import {paginate, paginateReset, paginateLoading} from '../actions/course';
import CircularProgress from 'material-ui/CircularProgress';
import Autosuggest from 'react-autosuggest';
import '../styles/suggestions.css';

import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
const rand = require('random-seed').create();
const numberWithCommas = (x) => {
    let parts = parseInt(x).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

const languages = [
    'Android',
    'Angular',
    'ASP',
    'ASP.NET',
    'C',
    'C++',
    'C#',
    'iOS',
    'Java',
    'JavaScript',
    'JSP',
    'NodeJS',
    'Objective C',
    'Perl',
    'PHP',
    'Python',
    'React',
    'React Native',
    'Ruby',
    'Swift'
];

function getSuggestions(value) {
    const escapedValue = value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return languages.filter(language => regex.test(language));
}

const getSuggestionValue = suggestion => suggestion;
const renderSuggestion = suggestion => <span>{suggestion}</span>;

const renderInputComponent = inputProps => (
    <div className="react-autosuggest__inputContainer">
        <i className="fa fa-search react-autosuggest__icon" aria-hidden="true"/>
        <input {...inputProps} />
    </div>
);

class SearchCourse extends Component {
    constructor (props, context) {
        super(props, context);
        this.state = {
            muiTheme: getMuiTheme(),
            dialogStyle: {display: 'none'},
            keyword: '',
            limit: 3,
            sort: {},
            suggestions: []
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

        this.loadInitial('');
    }

    loadInitial = (keyword) => {
        //this.props.paginateLoading(true);

        this.props.signError('');

        //this.props.paginateReset();

        const {limit} = this.state;

        const sort = this.randomSort();

        const self = this;
        const callback = () => {
            self.setState({sort});
        };

        //this.props.paginate(keyword, 1, limit, sort, callback);
    };

    randomSort = () => {
        const type = ['title', 'category', 'average', 'reviews', 'enrolled', 'price'];
        const sort_type = type[rand(type.length)];
        const order = [1, -1];
        const sort_order = order[rand(order.length)];

        return {
            field: sort_type,
            value: sort_order
        };
    };

    infiniteScroll = () => {
        if(!this.props.isLoading) {
            const {keyword, limit, sort} = this.state;
            const {total, page} = this.props;
            const _page = page + 1;

            if (_page > 0 && _page <= total) {
                this.props.paginate(keyword, _page, limit, sort, null);
            }
        }
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onInputChange = (event, { newValue, method }) => {
        this.setState({keyword: newValue});
    };

    onFormSubmit = (event) => {
        event.preventDefault();

        if(!this.props.isLoading) {
            const {keyword} = this.state;
            this.loadInitial(keyword);
        }
    };

    renderForm = () => {
        const {suggestions} = this.state;

        const inputProps = {
            placeholder: 'Please enter a keyword.',
            value: this.state.keyword,
            onChange: this.onInputChange
        };

        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <div style={{display: 'flex',
                    justifyContent:'center',
                    alignItems:'center'}}>
                        <span>
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                                renderInputComponent={renderInputComponent}
                            />
                        </span>
                        <span>
                            <RaisedButton label="Search" type="submit" primary={true}/>
        </span>
                    </div>
                </form>
            </div>
        );
    };

    handleDetail = (event, course) => {
        event.preventDefault();

        localStorage.setItem('course', course.no);
        this.props.history.push('/detail');
    };

    renderAuthor = (authors) => {
        return _.map(authors, (author, i) => {
            return (
                <div key={i}>{
                    <CardHeader
                        title={author.name}
                        subtitle={`${numberWithCommas(author.students)} Students`}
                        avatar={`${hostUrl}/images/${author.avatar}`}
                    />
                }</div>);
        });
    };

    courseDetail = (course) => {
        const text = `${numberWithCommas(course.enrolled)} students enrolled, rating: ${course.average} (${numberWithCommas(course.reviews)} reviews), Last updated ${dateFormat(course.updated, "m/yyyy")}`;

        return (
            <div onClick={(e) => this.handleDetail(e, course)}>
                <Card>
                    {this.renderAuthor(course._authors)}
                    <CardMedia
                        overlay={<CardTitle title={course.title}
                                            subtitle={text}/>}
                    >
                        <img src={`${hostUrl}/images/${course.picture}`}/>
                    </CardMedia>
                    <CardActions>
                        <FlatButton label="Read More..."/>
                    </CardActions>
                </Card>
            </div>
        );
    };

    renderCourses = () => {
        return _.map(this.props.courses, (course, i) => {
            return (
                <div key={i}>{this.courseDetail(course)}</div>);
        });
    };

    renderLoading = () => {
        if (this.props.isLoading) {
            return (
                <div style={this.state.dialogStyle}>
                    <CircularProgress color='orange' size={60} thickness={7}/>
                </div>);
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
        else {
            return (
                <div>
                    <div style={{
                        marginTop: 30,
                        marginBottom: 30,
                        marginLeft: 20,
                        marginRight: 20
                    }}>
                        Search Results
                        <br/>
                    </div>
                    <div style={{
                        marginTop: 30,
                        marginBottom: 30
                    }}>
                        {this.renderCourses()}
                    </div>
                    <div style={{
                        marginTop: 30,
                        marginBottom: 30
                    }}>
                        {this.renderLoading()}
                    </div>
                </div>
            );
        }
    };

    renderButton = () => {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin:10}}>
                <button
                    type="button"
                    name="loadmore"
                    className="btn btn-lg btn-danger"
                    onClick={(e) => {
                        e.preventDefault();
                        this.infiniteScroll();
                    }}>Load More</button>
            </div>
        );
    };

    render() {
        return (
            <div>
                <div style={{
                    marginTop: 20,
                    marginBottom: 20
                }}>
                    {this.renderForm()}
                </div>
                <div style={{
                    marginTop: 30,
                    marginBottom: 30
                }}>
                    {this.renderState()}
                </div>
                <div style={{
                    marginTop: 30,
                    marginBottom: 30
                }}>
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        hasError: state.paginate.error,
        isLoading: state.paginate.loading,
        courses: state.paginate.courses,
        total: state.paginate.total,
        page: state.paginate.page
    };
}

const mapDispatchToProps = dispatch => {
    return {
        //paginate: (keyword,page,limit,sort,callback) => dispatch(paginate(keyword,page,limit,sort,callback)),
        //paginateReset : () => dispatch(paginateReset()),
        //paginateLoading: (loading) => dispatch(paginateLoading(loading)),
        signError: (error) => dispatch(signError(error))
    }
};

export default SearchCourse = withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchCourse));
