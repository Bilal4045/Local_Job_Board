'use client';
import React from 'react';

export default function Navbar() {
  return (
    <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-3">
      <div className="text-lg font-bold">Job Board</div>
      <div className="flex space-x-4">
        <a href="#" className="hover:bg-gray-600 px-3 py-2 rounded">Home</a>
        <a href="#services" className="hover:bg-gray-600 px-3 py-2 rounded">Services</a>
        <a href="#about" className="hover:bg-gray-600 px-3 py-2 rounded">About</a>
        <a href="#signup" className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded">Get Started</a>
      </div>
    </div>
  );
}
