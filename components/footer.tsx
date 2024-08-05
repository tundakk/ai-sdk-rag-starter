// components/Footer.tsx

"use client";

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ padding: '10px', borderTop: '1px solid #ccc', marginTop: '20px', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} Laundry Booking System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
