import React from "react";
import { GoogleLogin } from '@react-oauth/google';

function RegisterComponent({ username, password, confirmPassword, email, setUsername, setPassword, setConfirmPassword, setEmail, handleSubmit }) {
    return (
        <div id='signup-box'>
            <form id='login-form' onSubmit={handleSubmit}>
                <label htmlFor='username'>Username: </label>
                <input type='text' name='username' id='username-signup' value={username} onChange={(e) => setUsername(e.target.value)}></input><br/>
                <label htmlFor='password'> Password: </label>
                <input type='text' name='password' id='password-signup' value={password} onChange={(e) => setPassword(e.target.value)}></input><br/>
                <label htmlFor='confirm-password'> Confirm Password: </label>
                <input type='text' name='confirm-password' id='confirm-password-signup' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input><br/>
                <label htmlFor='email'> Email Address: </label>
                <input type='text' name='email' id='email-signup' value={email} onChange={(e) => setEmail(e.target.value)}></input><br/>
                <input type='submit' value='Sign Up'></input>
            </form>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
            <p>Have an account already? <a href='/login'>Log in here.</a></p>
        </div>
    )
}

export default RegisterComponent;