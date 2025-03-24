import React, { useState } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [],
    availability: [],
    experience: ''
  });

  const interests = [
    'Food Distribution',
    'Animal Welfare',
    'Education',
    'Healthcare',
    'Environmental',
    'Administrative'
  ];

  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const array = name === 'interests' ? formData.interests : formData.availability;
      const updatedArray = checked
        ? [...array, value]
        : array.filter(item => item !== value);
      
      setFormData(prev => ({
        ...prev,
        [name]: updatedArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer With Us</h1>
          <p className="mt-2 text-lg text-gray-600">Join our community of changemakers and make a difference</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Interest
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {interests.map(interest => (
                <div key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    id={interest}
                    name="interests"
                    value={interest}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    onChange={handleChange}
                  />
                  <label htmlFor={interest} className="ml-2 text-sm text-gray-700">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availabilityOptions.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option}
                    name="availability"
                    value={option}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    onChange={handleChange}
                  />
                  <label htmlFor={option} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Previous Volunteer Experience
            </label>
            <textarea
              name="experience"
              id="experience"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}