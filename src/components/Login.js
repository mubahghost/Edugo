import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Login.css'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import loginImage from '../assets/login.png'; 

// Login component for authentication
function Login() {
    // useRef hooks to manage input fields for email and password
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    // useNavigate hook for programmatically navigating to other routes
    const navigate = useNavigate();
    // useState hooks to manage error and success messages
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle user login via Firebase authentication
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents the default form submit action
        const email = emailRef.current.value; // Retrieves the email input value
        const password = passwordRef.current.value; // Retrieves the password input value

        try {
            // Attempts to sign in the user with email and password
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/profile'); // Navigates to the profile page upon successful login
        } catch (error) {
            const errorMessage = "";
            setError(errorMessage); // Sets an error message if login fails
            alert("Check that you have added the correct details and try again.");
        }
    };

    // Function to handle password reset email request
    const handleForgotPassword = async () => {
        const email = emailRef.current.value; // Retrieves the email from the input field
        if (!email) {
            alert("Please enter your email address."); // Alerts if email field is empty
            return;
        }
        try {
            // Sends a password reset email to the provided email address
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent. Please check your email inbox."); // Sets a success message
        } catch (error) {
            setError("Failed to send password reset email: " + error.message); // Sets an error message on failure
        }
    };

    // Component return function that renders the login interface
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
                                {error && <div className="error-message">{error}</div>} 
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

export default Login; // Exports the Login component for use in other parts of the application
