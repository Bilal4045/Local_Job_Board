'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerSignin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    try {
      const res = await fetch(`${API_BASE}/customers/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save customer ID for dashboard use
        localStorage.setItem('customerId', data.customer._id);

        setMessage('Login successful');
        setIsSuccess(true);

        setTimeout(() => {
          router.push('/customer/dashboard');
        }, 1000);
      } else {
        const errorMsg =
          data.detail && typeof data.detail !== 'string'
            ? Array.isArray(data.detail)
              ? data.detail.map((d) => d.msg).join(', ')
              : data.detail
            : data.detail || data.error || 'Invalid credentials';
        setMessage(errorMsg);
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage('Server error or network issue');
      setIsSuccess(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Customer Sign In</h2>
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
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={formData.password}
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
            Sign In
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
}
