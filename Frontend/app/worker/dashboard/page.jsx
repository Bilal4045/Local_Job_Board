'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function WorkerDashboard() {
  const [workerName, setWorkerName] = useState('Loading...');
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState('available');
  const [currentJobs, setCurrentJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId');
    if (!workerId) {
      setWorkerName('Guest');
      return;
    }

    // Fetch worker info
    fetch(`${API_BASE}/worker/${workerId}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkerName(data.username || 'Unknown');
        setSkills(data.skill || []);
      })
      .catch(() => setWorkerName('Error'));

    // Fetch all bookings for this worker
    fetchBookings(workerId);

    // Set up automatic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBookings(workerId);
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refreshTrigger]);

  const fetchBookings = async (workerId) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/worker/${workerId}`);
      const bookings = await res.json();

      // split into current vs recent
      const pending = bookings.filter((b) => b.status === 'pending');
      const completed = bookings.filter((b) => b.status === 'completed');

      // fetch customer data for all pending jobs
      const pendingWithCust = await Promise.all(pending.map(async (b) => {
        const resC = await fetch(`${API_BASE}/customer/${b.customerId}`);
        const cust = await resC.json();
        return { ...b, customer: cust, skillsUsed: skills };
      }));
      setCurrentJobs(pendingWithCust);

      // fetch customer data for all completed jobs
      const withCust = await Promise.all(completed.map(async (b) => {
        const resC = await fetch(`${API_BASE}/customer/${b.customerId}`);
        const cust = await resC.json();
        return { ...b, customer: cust, skillsUsed: skills };
      }));
      setRecentJobs(withCust);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Navbar />
      <header className="h-48 flex items-center justify-center bg-black text-white border-b">
        <h1 className="text-4xl font-bold">{workerName}'s Dashboard</h1>
      </header>

      <main className="py-16 px-6 md:px-20 bg-white">
        {/* Availability */}

        <section className="bg-gray-100 p-6 rounded shadow mb-8">
         <p><b>{workerName}</b></p>
          <p>Status: <span className={status === 'available' ? 'text-green-600' : 'text-red-500'}>{status}</span></p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setStatus(status === 'available' ? 'offline' : 'available')}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >{status === 'available' ? 'Go Offline' : 'Go Online'}</button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Jobs
            </button>
          </div>
        </section>

        {/* Current Job */}
        <section className="bg-gray-100 p-6 rounded shadow mb-8">
          <h3 className="text-xl font-bold mb-4">Current Jobs</h3>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div key={job._id} className="mb-4 p-4 bg-white rounded shadow">
                <p><strong>Customer:</strong> {job.customer.username}</p>
                <p><strong>Scheduled:</strong> {new Date(job.serviceDate).toLocaleString()}</p>
                <p><strong>Skills Used:</strong> {job.skillsUsed.join(', ')}</p>
              </div>
            ))
          ) : <p>No current pending jobs.</p>}
        </section>

        {/* Recent Jobs */}
        <section className="bg-gray-100 p-6 rounded shadow mb-8">
          <h3 className="text-xl font-bold mb-4">Recent Jobs</h3>
          {recentJobs.length > 0 ? recentJobs.map((b) => (
            <div key={b._id} className="mb-4 p-4 bg-white rounded shadow">
        
              <p><strong>Customer:</strong> {b.customer.username}</p>
              <p><strong>Date:</strong> {new Date(b.serviceDate).toLocaleDateString()}</p>
              <p><strong>Skills Used:</strong> {b.skillsUsed.join(', ')}</p>
            </div>
          )) : <p>No completed jobs yet.</p>}
        </section>
      </main>

      <Footer />
    </>
  );
}
