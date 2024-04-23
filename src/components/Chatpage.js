import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styles/Chatpage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUserUid = auth.currentUser?.uid;
      if (currentUserUid) {
        const userRef = doc(db, 'users', currentUserUid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ id: userSnap.id, ...userSnap.data() });
        } else {
          console.error('User document not found in Firestore');
        }
      } else {
        console.error('No user UID found');
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const messagesRef = collection(db, 'general');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      console.error('Message text is empty.');
      return;
    }

    if (!user) {
      console.error('User details are missing.');
      return;
    }

    try {
      const messagesRef = collection(db, 'general');
      await addDoc(messagesRef, {
        text: newMessage,
        timestamp: serverTimestamp(),
        senderId: user.id,
        senderName: user.name,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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
            disabled={!user}
          />
          <button type="submit" disabled={!newMessage.trim() || !user}>Send</button>
        </form>
      </div>
    </>
  );
};

export default ChatPage;
