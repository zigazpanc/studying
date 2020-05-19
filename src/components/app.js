import React, {Component} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Header from './header';

import SearchCourse from './search-course';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {muiTheme: getMuiTheme()};
    }

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext() {
        return {muiTheme: this.state.muiTheme};
    }

    render() {
        const {muiTheme} = this.state;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Header {...this.props}/>
                    <SearchCourse/>
                    
                </div>
            </MuiThemeProvider>
        );
    }
}
