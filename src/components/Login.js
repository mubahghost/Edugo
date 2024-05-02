import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Login.css'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import loginImage from '../assets/login.png'; 

// Login component for handling user authentication
function Login() {
    // References to DOM elements for email and password input fields
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    // Hook to programmatically navigate to other routes
    const navigate = useNavigate();
    // State for storing error and success messages
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle user login using Firebase authentication
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents the form from submitting traditionally
        const email = emailRef.current.value; // Retrieves email from the input field
        const password = passwordRef.current.value; // Retrieves password from the input field

        try {
            await signInWithEmailAndPassword(auth, email, password); // Firebase sign-in function
            navigate('/profile'); // Navigate to profile page on successful login
        } catch (error) {
            setError("Login failed: " + error.message); // Set error message on login failure
            alert("Check that you have entered the correct details and try again.");
        }
    };

    // Function to handle sending a password reset email
    const handleForgotPassword = async () => {
        const email = emailRef.current.value; // Retrieves email from the input field
        if (!email) {
            alert("Please enter your email address to reset your password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email); // Firebase function to send password reset email
            setMessage("Password reset email sent. Please check your email inbox."); // Set success message on successful operation
        } catch (error) {
            setError("Failed to send password reset email: " + error.message); // Set error message on failure
        }
    };

    // Rendering part of the component
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
