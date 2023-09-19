import React, { useState } from 'react';
import { loginSuccess } from '../slices/loginSlice';
import LoginComponent from "../components/LoginComponent";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux/es/hooks/useSelector';

function LoginContainer() {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username,
            password,
        };

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token);
                dispatch(loginSuccess(responseData.user));
                window.location.href='/';
            } else {
                alert('Try again');
            }
        } catch(error) {
            console.log('Error: ', error)
        }
    }
    console.log(localStorage.getItem('authToken'));
    console.log(useSelector((state) => state.login.user))

    return (
        <LoginComponent
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
        />
    )
}

export default LoginContainer;