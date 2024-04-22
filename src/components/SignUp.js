import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import signUpImage from '../assets/signup.png';
import "../styles/SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState("");
  const [schools] = useState(["School A", "School B", "Institute A", "Institute B"]);
  const navigate = useNavigate();

  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\d{11}$/;  
  const nameRegex = /^[a-zA-Z\s]*$/;

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (!nameRegex.test(name)) {
      alert("Name should contain only letters and spaces");
      return;
    }
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid UK phone number (11 digits)");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formattedPhone = "+44" + phone; 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        email,
        school,
        phone: formattedPhone,  
        role,
      });

      await sendEmailVerification(user);
      alert("Registered successfully! Please check your email to verify your account.");
      navigate('/profile');
    } catch (error) {
      alert("Error during registration: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-screen">
        <div className="signup-content">
          <form onSubmit={handleSignUp}>
            <div className="field-group">
              <input type="text" className="signup-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="field-group">
              <input type="email" className="signup-input" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="field-group">
              <input type="password" className="signup-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="field-group">
              <input type="password" className="signup-input" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="field-group">
              <input type="tel" className="signup-input" placeholder="Phone Number (10 digits)" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="field-group">
              <select className="signup-input" value={school} onChange={e => setSchool(e.target.value)} required>
                <option value="" disabled>Select School</option>
                {schools.map((schoolOption, index) => (
                  <option value={schoolOption} key={index}>{schoolOption}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <select className="signup-input" value={role} onChange={e => setRole(e.target.value)} required>
                <option value="" disabled>Select Role</option>
                <option value="student">Student</option>
                <option value="admin">Teacher</option>
              </select>
            </div>
            <div className="buttons-right">
              <button type="submit" className="signup-button">Register Now</button>
            </div>
          </form>
        </div>
        <div className="signup-image-container">
          <img src={signUpImage} alt="Sign Up Visual" className="signup-image" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
