import React from 'react';

import App from '../components/app';
import Welcome from '../components/welcome';
import Signup from '../auth/signup';
import Signin from '../auth/signin';
import Signout from '../auth/signout';
import Detail from '../components/detail';
import DetailCourse from '../components/detail-course';
import ListCart from '../components/list-cart';
import Lecture from '../components/lecture';
import ViewLecture from '../components/view-lecture';
import ReviewComment from '../components/review-comment';
import ViewCourses from '../components/view-courses';

import SocialGoogle from '../components/social-google';

import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';

import createBrowserHistory from 'history/createBrowserHistory'

import reducers from '../reducers';

import ComposedAuth from '../middlewares/composed-auth';

import {BrowserRouter as Router, Route} from 'react-router-dom';

export const history = createBrowserHistory({
    forceRefresh: true
});

export const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

export const Routes = () => (
    <Router /*history={history}*/>
        <div>
            <Route exact path="/" component={App}/>
            <Route path="/welcome" component={ComposedAuth(Welcome)}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/signout" component={Signout}/>
            <Route path="/detail" component={Detail}/>
            <Route path={`/detail/:id`} component={DetailCourse}/>
            <Route path="/list-cart" component={ComposedAuth(ListCart)}/>
            <Route path="/lecture" component={Lecture}/>
            <Route path={`/view-lecture/:url`} component={ViewLecture}/>
            <Route path="/review-comment" component={ReviewComment}/>
            <Route path="/view-courses" component={ViewCourses}/>
            <Route path="/social-google" component={SocialGoogle}/>
        </div>
    </Router>
);
