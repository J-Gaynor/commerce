import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListingsContainer from './containers/ListingsContainer'
import LoginContainer from './containers/LoginContainer';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<ListingsContainer />} />
                <Route path='/login' element={<LoginContainer />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;