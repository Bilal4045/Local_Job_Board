'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="m-0 p-0 font-sans">
      <Navbar />

      {/* Hero Section */}
  <header
  className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/image.jpg')"
  }}
>
  {/* Black overlay */}
  <div className="absolute inset-0 bg-black/50 z-0" />

  {/* Hero content */}
  <div className="z-10 relative text-white text-center px-4">
    <h1 className="text-4xl font-bold mb-4">
      Find the Right Skilled Worker for Your Job
    </h1>
    <p className="text-xl mb-6">
      Electricians, Plumbers, Mechanics, Tutors & more – Connect with professionals today!
    </p>
    <a
      href="#signup"
      className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded"
    >
      Get Started
    </a>
  </div>
</header>





      {/* Services Section */}
      <section id="services" className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-8">Popular Services</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {[
            {
              title: 'Electricians',
              href: '/electricians',
              description: 'Find expert electricians for your home and office needs.'
            },
            {
              title: 'Plumbers',
              href: '/plumbers',
              description: 'Get skilled plumbers to fix your leaks and pipes.'
            },
            {
              title: 'Carpenters',
              href: '/carpenters',
              description: 'Hire professional carpenters for furniture and repairs.'
            }
          ].map((service) => (
            <div key={service.title} className="w-full sm:w-1/2 md:w-1/3 bg-white shadow-md rounded-lg p-6 transition-transform hover:-translate-y-2 border border-gray-200">
              <Link href={service.href}>
                <h5 className="text-xl font-semibold mb-2 text-blue-800 hover:underline">{service.title}</h5>
              </Link>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

   {/* Signup Section */}
<section id="signup" className="py-12 text-center">
  <h2 className="text-3xl font-bold mb-4">Join Us Today</h2>
  <p className="text-lg text-gray-700 mb-6">Choose how you want to get started:</p>

  <div className="flex flex-wrap justify-center gap-6">
    {/* Sign Up as Worker */}
    <div className="bg-white p-6 rounded shadow-md border w-64">
      <h3 className="text-xl font-semibold mb-4 text-blue-800">I am a Worker</h3>
      <Link
        href="/worker/signup"
        className="block bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mb-2"
      >
        Sign Up
      </Link>
      <Link
        href="/worker/signin"
        className="block bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        Sign In
      </Link>
    </div>

    {/* Sign Up as Customer */}
    <div className="bg-white p-6 rounded shadow-md border w-64">
      <h3 className="text-xl font-semibold mb-4 text-blue-800">I am a Customer</h3>
      <Link
        href="/customer/signup"
        className="block bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded mb-2"
      >
        Sign Up
      </Link>
      <Link
        href="/customer/signin"
        className="block bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        Sign In
      </Link>
    </div>
  </div>
</section>


      {/* About Section */}
      <section id="about" className="bg-gray-100 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-lg text-gray-700 px-4">
          We connect skilled workers with customers looking for reliable services. Easy, fast, and secure hiring process.
        </p>
      </section>

      <Footer />
    </div>
  );
}
