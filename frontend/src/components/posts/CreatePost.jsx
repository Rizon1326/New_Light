import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios'; // Ensure axios is properly configured

export const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Handles the uploaded file correctly
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('codeSnippet', codeSnippet);

    if (file) {
      formData.append('file', file); // Ensure correct key: 'file'
    }

    try {
      await api.post('http://localhost:5000/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/'); // Redirect to home after successful post creation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="Code Snippet (optional)"
          rows="4"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={handleFileChange}
          placeholder="Upload File (optional)"
          accept=".txt,.js,.jsx,.json" // Add relevant file types
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};