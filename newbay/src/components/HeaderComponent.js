import React from 'react';

function HeaderComponent({ handleLogout, isAuthenticated }) {
    return (
        <div id='header'>
            <input type='text' id='searchbar' placeholder='Search for an item'></input>
            {isAuthenticated ? (
                <>
                    <a href='/account' className='header-links'><h4>My Account</h4></a>
                    <button className='header-links' id='logout-button' onClick={handleLogout}><h4>Logout</h4></button>
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