import React, { useState } from 'react';
import "../styles/contact.css"; // Make sure this path is correct

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Thank you for contacting us!");
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Get in Touch</h1>
      <div className="contact-form-container">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="input-group">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
