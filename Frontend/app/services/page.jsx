'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function FindService() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/workers`)
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch workers:', err);
        setLoading(false);
      });
  }, []);

  const openConfirmModal = (worker) => {
    setSelectedWorker(worker);
    setShowConfirm(true);
  };

  const closeConfirmModal = () => {
    setSelectedWorker(null);
    setShowConfirm(false);
  };

  const handleConfirmHire = async () => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId || !selectedWorker) return;

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, workerId: selectedWorker._id }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowConfirm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(data.error || 'Failed to book.');
        setShowConfirm(false);
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Unexpected error');
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <h1 className="text-3xl font-bold mb-6">Available Workers</h1>

      {loading ? (
        <p>Loading workers...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white rounded shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  {worker.fullname || worker.username}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  Email: {worker.email || 'N/A'}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  Skills: {Array.isArray(worker.skill) ? worker.skill.join(', ') : 'N/A'}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Experience: {worker.experience} years
                </p>
              </div>
              <button
                onClick={() => openConfirmModal(worker)}
                className="mt-auto bg-blue-600 hover:bg-blue-800 text-white py-2 rounded"
              >
                Hire
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedWorker && (
       <div className="fixed inset-0 flex items-center justify-center bg-opacity-20 backdrop-blur-sm z-50">


          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to hire {selectedWorker.fullname || selectedWorker.username}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmHire}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-20 z-40">

          <div className="bg-white p-4 rounded shadow-lg w-64 text-center">
            <p className="text-green-600 font-semibold text-lg">Worker hired successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}
