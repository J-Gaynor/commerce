import React from 'react';
import { useSelector } from 'react-redux';

function HeaderComponent() {
    const isAuthenticated = useSelector((state) => state.login.user !== null);

    return (
        <div id='header'>
            <input type='text' id='searchbar' placeholder='Search for an item'></input>
            {isAuthenticated ? (
                <>
                    <a href='/account' className='header-links'><h4>My Account</h4></a>
                    <a href='/logout' className='header-links'><h4>Logout</h4></a>
                </>
            ) : (
                <>
                    <a href='/login' className='header-links'><h4>Login</h4></a>
                    <a href='/register' className='header-links'><h4>Register</h4></a>
                </>
            )}
      </div>
    );
};

export default HeaderComponent;