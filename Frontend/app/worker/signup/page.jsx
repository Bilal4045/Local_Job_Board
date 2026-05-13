'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function WorkerSignup() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    skill: '',
    contactnumber:'',
    experience: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/workers/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          skill: formData.skill,
          contactnumber: formData.contactnumber,
          experience: formData.experience,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Worker created successfully!');
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/worker/signin');
        }, 1000);
      } else {
        // FastAPI returns validation details under "detail" for 422 or error message for our custom exceptions
        const errorMsg =
          data.detail && typeof data.detail !== 'string'
            ? Array.isArray(data.detail)
              ? data.detail.map((d) => d.msg).join(', ')
              : data.detail
            : data.detail || data.error || 'Something went wrong';
        setMessage(errorMsg);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error or server issue');
      setIsSuccess(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Worker Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="skill"
            placeholder="Skills (comma separated)"
            className="w-full px-4 py-2 border rounded"
            value={formData.skill}
            onChange={handleChange}
            required
          />
             <input
            type="text"
            name="contactnumber"
            placeholder="contactnumber"
            className="w-full px-4 py-2 border rounded"
            value={formData.contactnumber}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (in years)"
            className="w-full px-4 py-2 border rounded"
            value={formData.experience}
            onChange={handleChange}
            required
          />
          {message && (
            <p
              className={`text-sm text-center ${
                isSuccess ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
}
