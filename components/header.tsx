// components/header.tsx

"use client";

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/book">Book a Slot</Link></li>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/chat">Chat</Link></li>
          <li><Link href="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;