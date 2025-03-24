// src/pages/NGODashboard.js
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function NGODashboard() {
  const [user, setUser] = useState(null);
  const [ngoData, setNgoData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const navigate = useNavigate();
  const auth = getAuth();
  
  // Check authentication and fetch NGO data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login/ngo');
        return;
      }
      
      setUser(currentUser);
      
      try {
        // Check if the user is an NGO
        const ngoDoc = await getDocs(query(
          collection(db, "ngos"), 
          where("email", "==", currentUser.email)
        ));
        
        if (ngoDoc.empty) {
          // User is not an NGO, redirect to user login
          auth.signOut();
          navigate('/login/ngo');
          return;
        }
        
        setNgoData({
          id: ngoDoc.docs[0].id,
          ...ngoDoc.docs[0].data()
        });
        
      } catch (error) {
        console.error("Error fetching NGO data:", error);
      }
    });
    
    return () => unsubscribe();
  }, [auth, navigate]);
  
  // Fetch issues based on filter
  useEffect(() => {
    if (!user) return;
    
    const fetchIssues = async () => {
      setLoading(true);
      
      try {
        let issuesQuery;
        
        if (filterStatus === 'all') {
          issuesQuery = query(
            collection(db, "issues"),
            orderBy("createdAt", "desc")
          );
        } else {
          issuesQuery = query(
            collection(db, "issues"),
            where("status", "==", filterStatus),
            orderBy("createdAt", "desc")
          );
        }
        
        const querySnapshot = await getDocs(issuesQuery);
        const issuesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'Unknown'
        }));
        
        setIssues(issuesList);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, [user, filterStatus]);
  
  // Update issue status
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await updateDoc(doc(db, "issues", issueId), {
        status: newStatus,
        updatedAt: new Date(),
        handledBy: {
          ngoId: ngoData.id,
          ngoName: ngoData.orgName,
          ngoEmail: user.email
        }
      });
      
      // Update the issue in the current state
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === issueId 
            ? { ...issue, status: newStatus } 
            : issue
        )
      );
      
      // Update selected issue if it's the one being modified
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => ({ ...prev, status: newStatus }));
      }
      
    } catch (error) {
      console.error("Error updating issue status:", error);
      alert("Failed to update issue status. Please try again.");
    }
  };
  
  // View issue details
  const viewIssueDetails = (issue) => {
    setSelectedIssue(issue);
  };
  
  // Close issue details panel
  const closeIssueDetails = () => {
    setSelectedIssue(null);
  };
  
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
          {ngoData && (
            <p className="mt-2 text-lg text-gray-600">Welcome, {ngoData.orgName}</p>
          )}
        </div>
        
        {/* Filter Controls */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Issues</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All Issues
            </button>
            <button
              onClick={() => setFilterStatus('new')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === 'new'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilterStatus('in-progress')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === 'in-progress'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === 'resolved'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Issues List */}
          <div className={`${selectedIssue ? 'lg:w-2/5' : 'w-full'} bg-white shadow rounded-lg overflow-hidden`}>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Reported Issues</h2>
              
              {loading ? (
                <div className="py-10 text-center">
                  <p>Loading issues...</p>
                </div>
              ) : issues.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-500">No issues found with the selected filter.</p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden overflow-y-auto" style={{ maxHeight: '70vh' }}>
                  <ul className="divide-y divide-gray-200">
                    {issues.map((issue) => (
                      <li key={issue.id} className="py-4">
                        <div 
                          className="flex cursor-pointer hover:bg-gray-50 p-2 rounded" 
                          onClick={() => viewIssueDetails(issue)}
                        >
                          <div className="flex-1">
                            <h3 className="text-md font-medium">{issue.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {issue.category && issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} • {issue.location}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Reported on {issue.createdAt}
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${issue.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                              ${issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${issue.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                            `}>
                              {issue.status === 'new' ? 'New' : 
                               issue.status === 'in-progress' ? 'In Progress' : 
                               issue.status === 'resolved' ? 'Resolved' : issue.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Issue Details */}
          {selectedIssue && (
            <div className="lg:w-3/5 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-medium text-gray-900">Issue Details</h2>
                  <button 
                    onClick={closeIssueDetails}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedIssue.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${selectedIssue.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                        ${selectedIssue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${selectedIssue.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {selectedIssue.status === 'new' ? 'New' : 
                         selectedIssue.status === 'in-progress' ? 'In Progress' : 
                         selectedIssue.status === 'resolved' ? 'Resolved' : selectedIssue.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedIssue.category && selectedIssue.category.charAt(0).toUpperCase() + selectedIssue.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1">{selectedIssue.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1 whitespace-pre-line">{selectedIssue.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Reported By</h4>
                    <p className="mt-1">{selectedIssue.userEmail}</p>
                    <p className="text-sm text-gray-400">Reported on {selectedIssue.createdAt}</p>
                  </div>
                  
                  {selectedIssue.imageUrls && selectedIssue.imageUrls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Images</h4>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        {selectedIssue.imageUrls.map((url, idx) => (
                          <div key={idx} className="relative h-40 overflow-hidden rounded-lg">
                            <img 
                              src={url} 
                              alt={`Issue image ${idx + 1}`} 
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={() => window.open(url, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Issue Actions */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500">Actions</h4>
                    <div className="mt-2 flex space-x-3">
                      {selectedIssue.status === 'new' && (
                        <button
                          onClick={() => updateIssueStatus(selectedIssue.id, 'in-progress')}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Start Working
                        </button>
                      )}
                      
                      {selectedIssue.status === 'in-progress' && (
                        <button
                          onClick={() => updateIssueStatus(selectedIssue.id, 'resolved')}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Mark as Resolved
                        </button>
                      )}
                      
                      {selectedIssue.status === 'resolved' && (
                        <button
                          onClick={() => updateIssueStatus(selectedIssue.id, 'in-progress')}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Reopen Issue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}