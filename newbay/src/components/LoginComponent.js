import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';

function LoginComponent({username, password, setUsername, setPassword, handleSubmit}) {
    return(
        <div id='login-box'>
            <form id='login-form' onSubmit={handleSubmit}>
                <label htmlFor='username'>Username: </label>
                <input type='text' name='username' id='username-login' value={username} onChange={(e) => setUsername(e.target.value)}></input><br/>
                <label htmlFor='password'> Password: </label>
                <input type='text' name='password' id='password-login' value={password} onChange={(e) => setPassword(e.target.value)}></input><br/>
                <input type='submit' value='Log in'></input>
            </form>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
            <p>Don't have an account? <a href='/register'>Sign up here.</a></p>
        </div>
    )
}

export default LoginComponent;