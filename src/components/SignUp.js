import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
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

  const fetchStudents = async () => {
    try {
      const studentsQuery = query(collection(firestore, "users"), where("role", "==", "student"));
      const querySnapshot = await getDocs(studentsQuery);
      const studentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(studentsList); // For debugging: check the fetched students in the console
      // Here you might want to set this data to the state or context
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        email,
        school,
        phone,
        role,
      });

      alert("User registered successfully");

      if (role === 'student') {
        await fetchStudents();
      }

      navigate('/profile'); // Redirect to the profile page on successful registration
    } catch (error) {
      alert("Error during registration: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-screen">
        <div className="signup-content">
          <form onSubmit={handleSignUp}>
            {/* Name field */}
            <div className="field-group">
              <i className="login__icon fas fa-user"></i>
              <input type="text" className="signup-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            {/* Email field */}
            <div className="field-group">
              <i className="login__icon fas fa-envelope"></i>
              <input type="email" className="signup-input" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {/* Password field */}
            <div className="field-group">
              <i className="login__icon fas fa-lock"></i>
              <input type="password" className="signup-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {/* Confirm Password field */}
            <div className="field-group">
              <i className="login__icon fas fa-lock"></i>
              <input type="password" className="signup-input" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {/* Phone field */}
            <div className="field-group">
              <i className="login__icon fas fa-phone"></i>
              <input type="tel" className="signup-input" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            {/* School field */}
            <div className="field-group">
              <select className="signup-input" value={school} onChange={e => setSchool(e.target.value)} required>
                <option value="" disabled>Select School</option>
                {schools.map((schoolOption, index) => (
                  <option value={schoolOption} key={index}>{schoolOption}</option>
                ))}
              </select>
            </div>
            {/* Role field */}
            <div className="field-group">
              <select className="signup-input" value={role} onChange={e => setRole(e.target.value)} required>
                <option value="" disabled>Select Role</option>
                <option value="student">Student</option>
                <option value="admin">Teacher</option>
                {/* Include more roles if necessary */}
              </select>
            </div>
            {/* Submit button */}
            <div className="buttons-right">
              <button type="submit" className="signup-button">
                Register Now
              </button>
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
