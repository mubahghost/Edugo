// Importing necessary React hooks and components from libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Firebase authentication and database utilities
import '../styles/Chatpage.css'; // CSS for styling the chat page

// The ChatPage component manages the chat interface and functionality
const ChatPage = () => {
  // State for storing messages displayed in the chat
  const [messages, setMessages] = useState([]);
  // State for managing text input for a new message
  const [newMessage, setNewMessage] = useState('');
  // State for storing the current user's information
  const [user, setUser] = useState(null);

  // useEffect hook to fetch and set the current user's data from Firebase Firestore when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUserUid = auth.currentUser?.uid; // Get UID of the logged-in user
      if (currentUserUid) {
        const userRef = doc(db, 'users', currentUserUid); // Reference to the user's document in Firestore
        const userSnap = await getDoc(userRef); // Retrieve user data from Firestore
        if (userSnap.exists()) { // Check if the user document exists
          setUser({ id: userSnap.id, ...userSnap.data() }); // Set user state with document ID and data
        } else {
          console.error('User document not found in Firestore'); // Log error if document does not exist
        }
      } else {
        console.error('No user UID found'); // Log error if UID is not found
      }
    };

    fetchCurrentUser(); // Call fetchCurrentUser when the component mounts
  }, []);

  // useEffect hook to listen to real-time updates of messages from Firestore
  useEffect(() => {
    const messagesRef = collection(db, 'general'); // Reference to the 'general' message collection in Firestore
    const q = query(messagesRef, orderBy('timestamp', 'asc')); // Create a query that orders messages by timestamp
    const unsubscribe = onSnapshot(q, (snapshot) => { // Listen to the query snapshot for real-time updates
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // Update messages state with new data
    });

    return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, []);

  // Handler for sending a new message
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!newMessage.trim()) { // Check if the message input is not just whitespace
      console.error('Message text is empty.'); // Log an error if message is empty
      return;
    }

    if (!user) { // Check if user details are available
      console.error('User details are missing.'); // Log an error if user details are missing
      return;
    }

    try {
      const messagesRef = collection(db, 'general'); // Reference to the 'general' message collection in Firestore
      // Add a new document to Firestore with message details
      await addDoc(messagesRef, {
        text: newMessage, // Text content of the message
        timestamp: serverTimestamp(), // Server-side timestamp to ensure consistency
        senderId: user.id, // UID of the sender
        senderName: user.name, // Name of the sender
      });
      setNewMessage(''); // Clear the new message input after sending
    } catch (error) {
      console.error('Error sending message:', error); // Log any errors that occur during sending
    }
  };

  // Render method that outputs the chat page UI
  return (
    <>
      <div className="header-container">
        <h1>This is a general chat to discuss details about the course</h1>
        <div className="navigation-buttons">
          <Link to="/contents" className="nav-button">View Contents</Link>
          <Link to="/subjects" className="nav-button">Subjects Page</Link>
          <Link to="/ProfilePage" className="nav-button">Profile Page</Link>
        </div>
      </div>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            // Render each message with conditional styling based on the sender
            <div key={message.id} className={`message ${message.senderId === user?.id ? 'sender' : 'receiver'}`}>
              <strong>{message.senderName || 'Anonymous'}:</strong> {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!user} // Disable input if user is not set
          />
          <button type="submit" disabled={!newMessage.trim() || !user}>Send</button>
        </form>
      </div>
    </>
  );
};

export default ChatPage; // Export the ChatPage component for use in other parts of the application
