// Imports for React, Router, Firebase, components, and styles
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import SubjectsAdmin from './pages/SubjectsAdmin';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import GettingStarted from './pages/GettingStarted';
import Contact from './components/Contact';
import ContentPage from "./components/ContentPage";
import ContentPageAdmin from './components/ContentPageAdmin';
import ChatPage from './components/Chatpage';
import Quiz from './components/Quiz';
import TeacherDashboard from './components/teacherDashboard';
import { auth, firestore } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App() {
  // State hooks for user data and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect hook to handle Firebase authentication state changes and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser(userDocSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();  // Cleanup the subscription
  }, []);

  // Function to handle user logout
  const logout = async () => {
    await signOut(auth);
  };

  // Conditional rendering based on the loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Router setup with routes protected based on authentication and user roles
  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/SignUp" element={user ? <Navigate to="/" replace /> : <SignUp />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/ProfilePage" element={user ? <ProfilePage /> : <Navigate to="/Login" replace />} />
        <Route path="/ContentPage" element={user ? <ContentPage /> : <Navigate to="/Login" replace />} />
        <Route path="/ContentPageAdmin" element={user && user.role === 'admin' ? <ContentPageAdmin /> : <Navigate to="/" replace />} />
        <Route path="/GettingStarted" element={<GettingStarted />} />
        <Route path='/Chatpage' element={<ChatPage />} />
        <Route path="/Subjects" element={<Subjects />} />
        {user && user.role === 'admin' && (
          <Route path="/SubjectsAdmin" element={<SubjectsAdmin />} />
        )}
        {user && user.role === 'admin' && (
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        )}
        {user && (
          <Route path="/Quiz" element={<Quiz />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
