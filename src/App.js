// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Footer from './components/Footer';

// Pages
import ReportIssue from './pages/ReportIssue';
import Donations from './pages/Donations';
import Volunteer from './pages/Volunteer';
import NGOsPartners from './pages/NGOsPartners';
import Contact from './pages/Contact';
import UserLogin from './pages/UserLogin';
import NGOLogin from './pages/NGOLogin';
import NGODashboard from './pages/NGODashboard';

// Auth wrapper component for protected routes
import AuthGuard from './components/AuthGuard';

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16"> {/* Add padding for fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/donate" element={<Donations />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/partners" element={<NGOsPartners />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Authentication Routes */}
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/ngo" element={<NGOLogin />} />
          
          {/* Protected Routes */}
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;