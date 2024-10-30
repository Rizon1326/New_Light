import React, { useState, useEffect } from 'react';
import api from '../../utils/axios'; // Ensure axios is properly configured

export const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('http://localhost:5000/notification', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to fetch notifications');
      }
    };

    fetchNotifications();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="notification-dropdown">
      <h3 className="font-bold text-lg">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id} className="p-2 border-b">
            <p>{notification.message}</p>
            {notification.postId && (
              <a
                href={`/post/${notification.postId._id}`}
                className="text-blue-500 underline"
              >
                {/* View Post: {notification.postId.title} */}
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
};