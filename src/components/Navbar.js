import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Report an Issue', href: '/report' },
  { name: 'Food Donations', href: '/donate' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'NGOs & Partners', href: '/partners' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 px-4">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-primary-600">Mero Samaj</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Conditional Login/Logout Button */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Logout
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginOptions(!showLoginOptions)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Login
                </button>
                
                {/* Login Options Dropdown */}
                {showLoginOptions && (
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-20">
                    <Link
                      to="/login/user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      Login as User
                    </Link>
                    <Link
                      to="/login/ngo"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      Login as NGO/Partner
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Login/Logout Options */}
              {currentUser ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login/user"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login as User
                  </Link>
                  <Link
                    to="/login/ngo"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login as NGO/Partner
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}