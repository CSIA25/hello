// src/components/AuthGuard.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// This component checks if the user is authenticated and has the correct role
export default function AuthGuard({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const checkAuth = async (currentUser) => {
      if (!currentUser) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // If no specific role is required, just being logged in is enough
      if (!requiredRole) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      try {
        // Check user role in Firestore
        let roleRef;
        if (requiredRole === 'ngo') {
          roleRef = collection(db, 'ngos');
        } else {
          roleRef = collection(db, 'users');
        }

        const q = query(roleRef, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkAuth(user);
    });

    return () => unsubscribe();
  }, [auth, requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!hasAccess) {
    // Redirect to appropriate login page based on required role
    return <Navigate to={requiredRole === 'ngo' ? '/login/ngo' : '/login/user'} />;
  }

  return children;
}