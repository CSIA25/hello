import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'environment',
    contactPhone: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const auth = getAuth();
  const storage = getStorage();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, [auth]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Limit to 5 images
      if (images.length + selectedFiles.length > 5) {
        setError('You can upload a maximum of 5 images');
        return;
      }
      
      setImages(prevImages => [...prevImages, ...selectedFiles]);
      
      // Create preview URLs
      const newImagePreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prevPreviews => [...prevPreviews, ...newImagePreviews]);
    }
  };
  
  const removeImage = (index) => {
    // Remove from both arrays
    const newImages = [...images];
    const newPreviews = [...imagePreview];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreview(newPreviews);
  };
  
  const uploadImagesToFirebase = async () => {
    if (images.length === 0) return [];
    
    const imageUrls = [];
    let uploadCount = 0;
    
    for (const imageFile of images) {
      // Create a unique file name
      const fileName = `${Date.now()}-${imageFile.name}`;
      const storageRef = ref(storage, `issue-images/${fileName}`);
      
      // Upload file
      await uploadBytes(storageRef, imageFile);
      
      // Get download URL
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
      
      // Update progress
      uploadCount++;
      setUploadProgress(Math.round((uploadCount / images.length) * 100));
    }
    
    return imageUrls;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setUploadProgress(0);
    
    try {
      // Upload images first
      const imageUrls = await uploadImagesToFirebase();
      
      // Create the report object
      const reportData = {
        ...formData,
        userId: currentUser ? currentUser.uid : 'anonymous',
        userEmail: currentUser ? currentUser.email : 'anonymous',
        status: 'new',
        createdAt: serverTimestamp(),
        imageUrls: imageUrls,
      };
      
      // Add the document to Firestore
      await addDoc(collection(db, 'issues'), reportData);
      
      // Reset form and show success message
      setFormData({
        title: '',
        description: '',
        location: '',
        category: 'environment',
        contactPhone: ''
      });
      
      setImages([]);
      setImagePreview([]);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting issue:', err);
      setError(err.message || 'An error occurred while submitting your report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pt-8">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Report an Issue</h1>
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Your issue has been reported successfully! We will look into it as soon as possible.
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Issue Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                id="category"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="environment">Environment</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="sanitation">Sanitation</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Kathmandu, Ward 10, Balaju"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe the issue in detail"
              />
            </div>
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Images (Max 5)
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  Select Images
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {images.length}/5 images selected
                </span>
              </div>
              
              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={src} 
                        alt={`Preview ${index + 1}`} 
                        className="h-32 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Progress */}
              {loading && images.length > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2.5 w-full">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                name="contactPhone"
                id="contactPhone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="e.g., +977 9812345678"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}