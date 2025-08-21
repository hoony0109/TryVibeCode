import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/index.css';
import App from './component/App';
import * as serviceWorker from './serviceWorker';

import Header from './header';
import Footer from './footer';

import User from './component/user';
import CS from './component/cs';
import Log from './component/log';
import Stat from './component/stat';
import Admin from './component/admin';

import './i18n'; // i18n 설정 파일 불러오기

ReactDOM.render(
    <Suspense fallback={<div>Loading...</div>}>
        <Router>
            <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/user" element={<User/>}/>
                <Route path="/cs" element={<CS/>}/>
                <Route path="/log" element={<Log/>}/>
                <Route path="/stat" element={<Stat/>}/>
                <Route path="/admin" element={<Admin/>}/>
            </Routes>
            <Footer/>
            </div>
        </Router>
    </Suspense>,        
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
