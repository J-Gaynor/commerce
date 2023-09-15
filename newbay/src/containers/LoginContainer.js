import React, { useState } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../slices/loginSlice';
import LoginComponent from "../components/LoginComponent";

const mapDispatchToProps = {
  loginRequest,
};

function LoginContainer(props) {
    const { loginRequest } = props;
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
                window.location.href='/';
            } else {
                alert('Try again');
            }
        } catch(error) {
            console.log('Error: ', error)
        }
    }

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

export default connect(null, mapDispatchToProps)(LoginContainer);