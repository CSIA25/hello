import React from 'react';

const stats = [
  { id: 1, name: 'Issues Resolved', value: '10,000+' },
  { id: 2, name: 'Meals Donated', value: '25,000+' },
  { id: 3, name: 'Active Volunteers', value: '500+' },
  { id: 4, name: 'NGO Partners', value: '50+' },
];

export default function Stats() {
  return (
    <div className="bg-primary-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our Impact in Numbers
          </h2>
          <p className="mt-3 text-xl text-primary-100 sm:mt-4">
            Together, we're making a real difference in our community
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8 lg:max-w-none lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-100">
                {stat.name}
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}