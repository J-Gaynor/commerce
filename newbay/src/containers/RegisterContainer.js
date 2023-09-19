import { useState } from "react";
import RegisterComponent from "../components/RegisterComponent";

function RegisterContainer() {
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
                console.log('success')
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