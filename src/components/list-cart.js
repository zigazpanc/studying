import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {buyCourse, listCart, addCart, removeCart, payCart} from '../actions/cart';
import {userInfo} from '../actions';

import {hostUrl} from '../config';

import SignIn from '../auth/signin';

import Header from './header';
import Footer from './footer';

import '../styles/detail.css';

const numberWithCommas = (x) => {
    let parts = parseInt(x).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

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

class ListCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            open: false,
            total: 0
        };
    }

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext() {
        return {muiTheme: this.state.muiTheme};
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        if(token) {
            this.props.userInfo();
        }

        this.props.listCart();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps !== this.props) {
            this.combineTotal(nextProps.courses);
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    combineTotal = (courses) => {
        if(courses) {
            if(courses.length > 0) {
                let amount = 0;
                courses.map((course) => {
                    amount += course.price;
                });

                this.setState({total: amount});
            }
        }
    };

    payCart = () => {
        if (this.props.logged) {
            this.props.payCart(this.props.courses);
        }
        else {
            this.handleOpen();
        }
    };

    removeCart = (course_no) => {
        if (this.props.logged) {
            this.props.removeCart(course_no);
        }
        else {
            this.handleOpen();
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
                                    <span>Shopping Cart</span>
                                </div>
                                <div className="text-size-fifth">
                                    <span className="text-emphasis-third">{courses.length}</span><span className="text-white"> Courses in Cart</span>
                                </div>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    listCourse = (course) => {
        return (
            <div>
                <br/>
                <Paper zDepth={3} style={{
                    width: '100%',
                    height: '100%',
                    marginBottom: 10,
                    overflow: 'hidden',
                    backgroundColor: '#FFF',
                    display: 'block'
                }}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-4">
                                <div style={{marginLeft:3, marginRight:3, marginTop:8, marginBottom:8, overflow:'hidden'}}>
                                    <img style={{width:'100%',height:'100%'}} src={`${hostUrl}/images/${course.picture}`}/>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div style={{marginLeft:10, marginRight:10,marginTop:12, marginBottom:12}}>
                                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                        <span  className="text-size-fifth text-bold text-emphasis-fourth">${course.price}</span>
                                <span>
                                    <FlatButton
                                        secondary={true}
                                        label="Remove"
                                        onTouchTap={() => {this.removeCart(course.no)}}
                                    />
                                </span>
                                </div>
                                <div className="text-size-fifth text-bold">{course.title}</div>
                                <div className="text-size-fifth">{course.subtitle}</div>
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
        const {courses} = this.props;

        if(courses) {
            return _.map(courses, (course, i) => {
                return (
                    <div key={i}>
                        {this.listCourse(course)}
                    </div>
                );
            })
        }
    };

    renderCheckout = () => {
        return (
            <div style={{width: '100%', backgroundColor: 'rgba(33, 33, 33, 0.9)'}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <br/>
                            <div className="text-size-second text-bold text-white">Total : <span className="text-size-second text-emphasis-third text-bold">${numberWithCommas(this.state.total)}</span>
                    </div>
                            <br/>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                margin:10}}>
                                <button
                                    type="button"
                                    name="paycart"
                                    className="btn btn-lg btn-primary btn-block"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.payCart();
                                    }}>Checkout</button>
                </div>
                            <br/>
                        </div>
                    </div>
            </div>
            </div>
        );
    };

    render() {
        return (
            <div>
                <Header/>
                {this.renderDialog()}
                {this.renderTop()}
                {this.renderList()}
                {this.renderCheckout()}
                <Footer/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged: state.auth.logged,
        user: state.auth.user,
        courses: state.fetchCartList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        buyCourse: (course_no) => dispatch(buyCourse(course_no)),
        listCart: () => dispatch(listCart()),
        addCart: (course_no) => dispatch(addCart(course_no)),
        removeCart: (course_no) => dispatch(removeCart(course_no)),
        payCart: (courses) => dispatch(payCart(courses)),
        userInfo: () => dispatch(userInfo())
    }
};

export default ListCart = withRouter(connect(mapStateToProps, mapDispatchToProps)(ListCart));
