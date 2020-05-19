import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {fullWhite} from 'material-ui/styles/colors';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {userInfo} from '../actions';

import {hostUrl} from '../config';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muiTheme: getMuiTheme(),
            open: false
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
    }

    handleToggle = () => {
        return this.setState({open: !this.state.open});
    };

    handleClose = () => {
        return this.setState({open: false});
    };

    handleHome = () => {
        this.props.history.push('/');
    };

    menuUser = () => {
        let avatar_image = `${hostUrl}/images/anonymous.png`;
        let name ='';
        let email = '';

        if(this.props.logged) {
            const {user} = this.props;
            if (user) {
                avatar_image = user.profile.picture;
                name = user.profile.name;
                email = user.email;
            }
        }

        return (
            <div style={{overflow:'hidden', margin:0, padding:0}}>
                <div style={{
                    margin:0,
                    padding:0,
                    width:'100%',
                    height:'220px',
                    backgroundImage: `url(/public/assets/images/office.jpg)`,
                    backgroundSize: '100%'
                }} onClick={(e) => {e.preventDefault(); this.handleClose();}}>
                    <div style={{overflow:'hidden', margin:0, paddingTop:20, paddingBottom:0, paddingLeft:20, paddingRight:20}}>
                        <img src={`${avatar_image}`} width="80px" height="80px" alt="" className="img-circle" style={{marginLeft:0,marginRight:0, verticalAlign:'middle'}}/>
                    </div>
                    <div style={{margin:0, paddingLeft:26, paddingRight:26}}>
                        <p className="text-white text-bold" style={{height:12}}>{name}</p>
                        <p className="text-white" style={{height:12}}>{email}</p>
                    </div>
                </div>
                <div style={{height:10}}/>
            </div>
        );
    };

    menuLogin = (close) => {
        if (!this.props.logged) {
            return (
                <MenuItem primaryText={this.renderText("log djjdin")} onTouchTap={() => {
                    this.props.history.push('/signin');
                    if (close) this.handleClose();
                }}/>);
        }
        else {
            return (
                <MenuItem primaryText={this.renderText("Logout")} onTouchTap={() => {
                    this.props.history.push('/signout');
                    if (close) this.handleClose();
                }}/>);
        }
    };

    renderLogin = () => {
        if (!this.props.logged) {
            return <FlatButton
                label="Login"
                onTouchTap={() => {
                    this.props.history.push('/signin');
                }}
            />
        }
        else {
            return <FlatButton
                label="Logout"
                onTouchTap={() => {
                    this.props.history.push('/signout');
                }}
            />;
        }
    };

    menuCart = (close) => {
        if (this.props.logged) {
            return (
                <MenuItem primaryText={this.renderText(<div><i className="fa fa-shopping-cart" aria-hidden="true" style={{marginRight:10}}/><span>View Cart</span></div>)} onTouchTap={() => {
                    this.props.history.push('/list-cart');
                    if(close) this.handleClose();
                }}/>
            );
        }
    };

    menuCourses = (close) => {
        if (this.props.logged) {
            return (
                <MenuItem primaryText={this.renderText(<div><i className="fa fa-graduation-cap" aria-hidden="true" style={{marginRight:10}}/><span>My Courses</span></div>)} onTouchTap={() => {
                    this.props.history.push('/view-courses');
                    if(close) this.handleClose();
                }}/>
            );
        }
    };

    renderMore = () => {
        return (
            <div>
                <IconMenu
                    iconButtonElement={
                        <IconButton><MoreVertIcon color={fullWhite}/></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    {this.menuCourses(false)}
                    {this.menuCart(false)}
                    <MenuItem primaryText={this.renderText("Sign Up")} onTouchTap={() => {
                        this.props.history.push('/signup');
                    }}/>
                    {this.menuLogin(false)}
                </IconMenu>
            </div>
        );
    };

    renderNav = () => {
        return (
            <div>
                <AppBar
                    title={<span onClick={this.handleHome} style={{cursor: "pointer"}}>iStudy</span>}
                    titleStyle={{textAlign: "center"}}
                    onLeftIconButtonTouchTap={this.handleToggle}
                    iconElementRight={this.props.logged ? this.renderMore() : this.renderLogin()}
                />
            </div>
        );
    };

    renderText = (text) => {
        return (
            <div style={{margin:0, paddingLeft:26, paddingRight:26}}>{text}</div>
        );
    };

    renderDrawer = () => {
        return (
            <div>
                <Drawer
                    docked={false}
                    width={400}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <MenuItem innerDivStyle={{margin:0,padding:0}} primaryText={this.menuUser()}/>
                    <div className="divider"/>
                    {this.menuCourses(true)}
                    {this.menuCart(true)}
                    <div className="divider"/>
                    <MenuItem primaryText={this.renderText("Sign Up")} onTouchTap={() => {
                        this.props.history.push('/signup');
                        this.handleClose();
                    }}/>
                    {this.menuLogin(true)}
                </Drawer>
            </div>
        );
    };

    render() {
        return (
            <div>
                {this.renderNav()}
                {this.renderDrawer()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged: state.auth.logged,
        user: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        userInfo: () => dispatch(userInfo())
    }
};

export default Header = withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
