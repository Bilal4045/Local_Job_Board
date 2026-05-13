'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerDashboard() {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [bookingToComplete, setBookingToComplete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    console.log('Customer ID:', customerId);

    if (!customerId) {
      setCustomerName('Guest');
      return;
    }

    fetch(`${API_BASE}/customer/${customerId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Fetch error: ${res.status} ${errorText}`);
        }
        return res.json();
      })
      .then((data) => {
        setCustomerName(data.username || 'Customer');
        setEmail(data.email || '');
      })
      .catch((err) => {
        console.error('Fetch customer error:', err);
        setCustomerName('Guest');
        setEmail('');
      });

    fetch(`${API_BASE}/bookings/customer/${customerId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Fetch bookings error: ${res.status} ${errorText}`);
        }
        return res.json();
      })
      .then((data) => {
        setBookings(data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
      });
  }, []);

  const confirmComplete = (bookingId) => {
    setBookingToComplete(bookingId);
    setShowCompleteModal(true);
  };

  const handleMarkCompleted = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingToComplete}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Complete failed: ${errorText}`);
      }

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingToComplete ? { ...b, status: 'completed' } : b
        )
      );

      setShowCompleteModal(false);
      setBookingToComplete(null);
    } catch (error) {
      console.error('Failed to complete booking:', error);
      alert('Failed to mark as completed');
      setShowCompleteModal(false);
    }
  };

  const confirmDelete = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingToDelete}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete failed: ${errorText}`);
      }

      setBookings((prev) =>
        prev.filter((b) => b._id !== bookingToDelete)
      );

      setShowDeleteModal(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error('Failed to delete booking:', error);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Navbar />
      <header className="h-48 flex items-center justify-center bg-black text-white border-b">
        <h1 className="text-4xl font-bold">{customerName}'s Dashboard</h1>
      </header>

      <main className="py-16 px-6 md:px-20 bg-white">
        {/* Welcome Section */}
        <section className="bg-gray-100 p-6 rounded shadow mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {customerName}</h2>
          {email && <p className="text-gray-700">Email: {email}</p>}
        </section>

        {/* Explore Services */}
        <section className="bg-gray-100 p-6 rounded shadow mb-8">
          <h3 className="text-xl font-bold mb-2">Explore Services</h3>
          <p className="text-gray-600 mb-4">Browse and book skilled workers easily.</p>
          <button
            onClick={() => router.push('/services')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Find Services
          </button>
        </section>

        {/* Booking History */}
        <section className="bg-gray-100 p-6 rounded shadow mb-8">
          <h3 className="text-xl font-bold mb-2">Your Bookings</h3>
          {bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className={`p-4 border rounded shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2 ${
                    booking.status === 'completed' ? 'bg-green-50' : 'bg-white'
                  }`}
                >
                  <div>
                    <p className="font-semibold">
                      Worker: {booking.workerName || 'Unknown'}
                    </p>
                    <p>
                      Date:{' '}
                      {booking.serviceDate
                        ? new Date(booking.serviceDate).toLocaleDateString()
                        : 'Invalid Date'}
                    </p>
                    <p className={booking.status === 'completed' ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                      Status: {booking.status === 'completed' ? '✓ Completed' : 'Pending'}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-2 md:mt-0">
                    {booking.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => confirmComplete(booking._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => confirmDelete(booking._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no bookings yet.</p>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Are you sure you want to cancel this booking?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Are you sure you want to mark this task as completed?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleMarkCompleted}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Yes, Complete
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
