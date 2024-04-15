import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Login.css'; // Adjust path as needed
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import loginImage from '../assets/login.png'; // Ensure this path is correct

function Login() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/profile'); // Redirect to profile page on successful login
        } catch (error) {
            setError("Login failed: " + error.message); // Display error message
        }
    };

    return (
        <>
            <div className="container">
                <div className="screen">
                    <div className="screen__content">
                        <form className="login" onSubmit={handleLogin}>
                            <div className="login__field">
                                <i className="login__icon fas fa-user"></i>
                                <input type="text" className="login__input" ref={emailRef} placeholder="User name / Email" />
                            </div>
                            <div className="login__field">
                                <i className="login__icon fas fa-lock"></i>
                                <input type="password" className="login__input" ref={passwordRef} placeholder="Password" />
                            </div>
                            <div className="buttons-container">
                                <Button type="submit" variant="primary" className="login__submit">
                                    Log In Now
                                </Button>
                                {error && <div className="error-message">{error}</div>}
                                <Link to="/signup">
                                    <Button variant="primary" className="login__submit">
                                        SignUp
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                    <div className="login-image-container">
                        <img src={loginImage} alt="Login" className="login-image" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
