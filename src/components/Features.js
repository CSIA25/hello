import React from 'react';
import {
  UserGroupIcon,
  HeartIcon,
  HandRaisedIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Report an Issue',
    description: 'Upload images, add location tags, and report social problems like homelessness or animal welfare.',
    icon: UserGroupIcon,
  },
  {
    name: 'Food Donation',
    description: 'Restaurants and individuals can donate surplus food to help reduce hunger in our community.',
    icon: HeartIcon,
  },
  {
    name: 'Volunteer Program',
    description: 'Sign up for volunteering tasks such as food delivery or NGO assistance.',
    icon: HandRaisedIcon,
  },
  {
    name: 'NGO/INGO Network',
    description: 'Connects reported issues with relevant organizations for immediate response.',
    icon: BuildingOfficeIcon,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How We Make a Difference
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides various ways to contribute to social causes and make a positive impact in our community.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}