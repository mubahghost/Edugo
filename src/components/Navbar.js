import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import LogoImage from '../assets/Logo.png'; 
import { signOut } from "firebase/auth";
import { auth } from '../firebase';

function Navbar({ user }) {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirect to home page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <nav className='navbar'>
            <Link to="/" className="logoContainer">
                <img src={LogoImage} alt="Logo" className="navbarLogo" />
                <span className="logoText">EDUGO</span>
            </Link>
            <div className='links open'>
                <Link to="/">Home</Link>
                <Link to="/Contact">Contact</Link>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <>
                                <Link to="/ContentPageAdmin">Content Page Admin</Link>
                                <Link to="/SubjectsAdmin">Subjects Admin</Link>
                                <Link to="/ProfilePage">Profile Page</Link>
                                <Link to="/teacherDashboard">TeacherDashboard</Link>

                                
                            </>
                        )}
                        {user.role === 'student' && (
                            <>
                                <Link to="/Subjects">Subjects</Link>
                                <Link to="/ContentPage">Content Page</Link>
                                <Link to="/Quiz">Quiz</Link>
                                <Link to="/ProfilePage">Profile Page</Link>
                            </>
                        )}
                        <span className="logoutButton" onClick={handleLogout}>Logout</span>
                    </>
                ) : (
                    <>
                        <Link to="/Login">Login</Link>
                        <Link to="/SignUp">SignUp</Link>
                        <Link to="/ProfilePage">Profile Page</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
