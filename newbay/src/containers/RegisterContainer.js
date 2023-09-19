import { useState } from "react";
import { loginSuccess } from "../slices/loginSlice";
import RegisterComponent from "../components/RegisterComponent";
import { useDispatch } from "react-redux";

function RegisterContainer() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = {
            username,
            password,
            confirmPassword,
            email
        };

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.user);
                localStorage.setItem('authToken', responseData.token);
                dispatch(loginSuccess(responseData.user));
                window.location.href='/';                
            } else {
                alert('failure')
            }
        } catch(error) {
            console.log('Error: ', error)
        }
    }

    return(
        <RegisterComponent 
            username={username}
            password={password}
            confirmPassword={confirmPassword}
            email={email}
            setUsername={setUsername}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
        />
    )
}

export default RegisterContainer;