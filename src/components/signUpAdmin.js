import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/signUpAdmin.css";

function SignUpAdmin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const educationLevelRef = useRef();
  const instituteRef = useRef();
  const phoneNumberRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const educationLevel = educationLevelRef.current.value;
    const institute = instituteRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Additional data can be stored in a separate collection in Firestore
      // Here, we only create the user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully");
      navigate('/Login'); // Redirect to login page after signing up
    } catch (error) {
      console.log("Error during sign up:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="header">
        <h1>Sign Up</h1>  
      </div>
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <form className="login" onSubmit={handleSignUp}>
              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input type="text" className="login__input" ref={emailRef} placeholder="Email" />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-lock"></i>
                <input type="password" className="login__input" ref={passwordRef} placeholder="Password" />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-lock"></i>
                <input type="password" className="login__input" ref={confirmPasswordRef} placeholder="Confirm Password" />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-graduation-cap"></i>
                <select className="login__input" ref={educationLevelRef}>
                  <option value="">Select Education Level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-building"></i>
                <select className="login__input" ref={instituteRef}>
                  <option value="">Select Institute</option>
                  <option value="Institute A">Institute A</option>
                  <option value="Institute B">Institute B</option>
                  <option value="Institute C">Institute C</option>
                </select>
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-phone"></i>
                <input type="tel" className="login__input" ref={phoneNumberRef} placeholder="Phone Number" />
              </div>
              <button className="button login__submit">
                <span className="button__text">Sign Up</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpAdmin;
