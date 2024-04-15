import React from 'react';
import '../styles/Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
function Footer() {
  return (
    <div className='footer'>
      <div className='SocialLinks'>
        <InstagramIcon />
      </div>
      <p>&copy; 2024 EDUGO</p>
    </div>
  );
}

export default Footer;
