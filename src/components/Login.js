import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Login.css'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import loginImage from '../assets/login.png'; 

function Login() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Handle user login
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/profile');
        } catch (error) {
            setError("Login failed: " + error.message);
            alert("Check that you have entered the correct details and try again.");
        }
    };

    // Send password reset email
    const handleForgotPassword = async () => {
        const email = emailRef.current.value;
        if (!email) {
            alert("Please enter your email address to reset your password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent. Please check your email inbox.");
        } catch (error) {
            setError("Failed to send password reset email: " + error.message);
        }
    };

    return (
        <>  
            <div className="container">
                <div className="screen">
                    <div className="screen__content">
                        <form className="login" onSubmit={handleLogin}>
                            <div className="login__field">
                                <input type="text" className="login__input" ref={emailRef} placeholder="Email" />
                            </div>
                            <div className="login__field">
                                <input type="password" className="login__input" ref={passwordRef} placeholder="Password" />
                            </div>
                            
                            <div className="buttons-container">
                                <Button type="submit" variant="primary" className="login__submit">
                                    Log In Now
                                </Button>
                                <Button onClick={handleForgotPassword} variant="primary" className="login__submit">
                                    Forgot Password?
                                </Button>
                                {message && <div className="success-message">{message}</div>}
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
