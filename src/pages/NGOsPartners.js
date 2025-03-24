import React from "react";
import { UsersIcon, GlobeAltIcon, AcademicCapIcon, HeartIcon } from "@heroicons/react/24/solid";

const partners = [
  {
    name: "Helping Hands Nepal",
    description: "Providing food, shelter, and education to underprivileged communities.",
    icon: UsersIcon,
  },
  {
    name: "Green Earth Initiative",
    description: "Focusing on sustainability and environmental conservation across Nepal.",
    icon: GlobeAltIcon,
  },
  {
    name: "EduForAll",
    description: "Empowering children through free and quality education programs.",
    icon: AcademicCapIcon,
  },
  {
    name: "HealthFirst",
    description: "Ensuring medical access to rural and underprivileged populations.",
    icon: HeartIcon,
  },
];

export default function NGOsPartners() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-primary-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Our NGOs & Partners</h1>
        <p className="text-lg mt-2">Collaborating for a better tomorrow.</p>
      </section>

      {/* Partners Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-6 rounded-xl text-center hover:shadow-lg transition transform hover:-translate-y-2 duration-300"
            >
              <partner.icon className="w-16 h-16 mx-auto text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{partner.name}</h3>
              <p className="text-gray-600 mt-2">{partner.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold">Want to Collaborate?</h2>
        <p className="mt-2 text-lg">Join us in making a difference. Let's work together.</p>
        <a
          href="/contact"
          className="mt-4 inline-block bg-white text-primary-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Get Involved
        </a>
      </section>
    </div>
  );
}
