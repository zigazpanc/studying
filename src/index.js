import seedrandom from 'seedrandom';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {Routes, store} from './routes';
import {signIn} from './actions';

import 'jquery';

import './styles/html5reset-1.6.1.css';

import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

// import 'materialize-css/dist/css/materialize.css';
import './styles/collapsible.css';
import 'materialize-css/dist/js/materialize';

import './fonts/Roboto.css';
import './fonts/material-icons.css';

import './styles/social.css';
import './styles/style.css';


const token = localStorage.getItem('token');
if (token) {
    store.dispatch(signIn());
}

ReactDOM.render(
    <Provider store={store}>
        <Routes/>
    </Provider>,
    document.getElementById('root'));
