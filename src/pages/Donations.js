import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Donations() {
  const [donationType, setDonationType] = useState('give');
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    location: '',
    pickupDate: '',
    description: ''
  });

  const [donations, setDonations] = useState([]); // State to store donations

  // Fetch donations from Firestore
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donations"));
        const donationsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDonations(donationsList);
      } catch (error) {
        console.error("Error fetching donations: ", error);
      }
    };

    fetchDonations();
  }, []); // Runs once when component loads

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "donations"), {
        ...formData,
        donationType,
        timestamp: new Date(),
      });
      alert("Donation data submitted successfully!");
      setFormData({ foodType: '', quantity: '', location: '', pickupDate: '', description: '' });

      // Refresh donations after submission
      const querySnapshot = await getDocs(collection(db, "donations"));
      const donationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donationsList);
      
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Food Donations</h1>
          
          <div className="flex space-x-4 mb-8">
            <button
              className={`px-4 py-2 rounded-md ${
                donationType === 'give'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setDonationType('give')}
            >
              Give Donation
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                donationType === 'receive'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setDonationType('receive')}
            >
              Request Food
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="foodType" className="block text-sm font-medium text-gray-700">
                Food Type
              </label>
              <select
                name="foodType"
                id="foodType"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onChange={handleChange}
              >
                <option value="">Select food type</option>
                <option value="cooked">Cooked Food</option>
                <option value="packaged">Packaged Food</option>
                <option value="fresh">Fresh Produce</option>
                <option value="grains">Grains & Cereals</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity (servings)
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                {donationType === 'give' ? 'Pickup Location' : 'Delivery Location'}
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">
                {donationType === 'give' ? 'Pickup Date & Time' : 'Needed By Date & Time'}
              </label>
              <div className="mt-1 relative">
                <input
                  type="datetime-local"
                  name="pickupDate"
                  id="pickupDate"
                  required
                  className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Additional Details
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                {donationType === 'give' ? 'Submit Donation' : 'Request Food'}
              </button>
            </div>
          </form>

          {/* Displaying the list of donations */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Donations</h2>
            {donations.length > 0 ? (
              <ul>
                {donations.map(donation => (
                  <li key={donation.id} className="border-b py-2">
                    <strong>{donation.foodType}</strong> - {donation.quantity} servings @ {donation.location} 
                    <span className="text-gray-500"> ({donation.donationType})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No donations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
