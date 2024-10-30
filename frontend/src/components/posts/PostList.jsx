import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import api from '../../utils/axios'; // Ensure axios is properly configured

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('http://localhost:5000/post'); // Fetch posts
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};