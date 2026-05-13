'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function CarpentersPage() {
  return (
    <>
      <Navbar />

      <header
        className="bg-cover bg-center h-64 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://www.thespruce.com/thmb/2mQ6hYtoaFcuxnQx_EX5I7xR87w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/a-frame-houses-4772019-hero-7cacd243cfe74fb8b06f44760ea59f35.jpg')",
        }}
      >
        <div className="bg-black bg-opacity-60 text-white p-8 rounded">
          <h1 className="text-4xl font-bold">Carpenters</h1>
        </div>
      </header>

      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Reliable Carpenters for Custom Woodwork & Repairs
        </h2>
        <p className="text-center max-w-2xl mx-auto text-gray-700 mb-8">
          From handcrafted furniture to home repairs, our carpenters bring expertise and precision to every job. Trusted for quality woodwork and fast service.
        </p>
        <ul className="list-disc list-inside max-w-xl mx-auto text-gray-700 space-y-2">
          <li>Custom Furniture Making</li>
          <li>Door and Window Repairs</li>
          <li>Wooden Flooring & Paneling</li>
        </ul>
      </section>

      <Footer />
    </>
  );
}
