import axios from 'axios';
import React from 'react';

import '../scss/style.scss';

import { render } from 'react-dom';

import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';

import {
	getElem,
	hidePreloader
} from './utils.js';

import routes from './routes.js'

import Home from './components/Home';
import Article from './components/Article';
import Sentenses from './components/Sentenses';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.API_BASE_URL;


render(
    <Router>
        <Switch>
            <Route
                path = {routes.home}
                component = {Home}
                    />
            <Route
                path = {routes.article}
                component = {Article}
                    />
            <Route
                path = {routes.sentenses}
                component = {Sentenses}
					/>
            <Redirect
                from = "/"
                to = {routes.home}
                    />
        </Switch>
    </Router>, getElem('#root')[0]);

/* Disable preloader */
hidePreloader('.preloader_global');
