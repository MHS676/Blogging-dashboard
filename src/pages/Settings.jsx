import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you're using token-based authentication
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin-information`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdminInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin information:', error);
        setError('Failed to fetch admin information');
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading admin information...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="flex items-center justify-center mt-40">
      {adminInfo ? (
        <div className="admin-info bg-white p-8 rounded-lg shadow-md text-center">
          <div className="avatar mx-auto mb-4">
            <div className="mask mask-squircle h-24 w-24">
              <img
                className=''
                src={adminInfo.personal_info.profile_img || 'default-img.png'}
                alt={adminInfo.personal_info.username || 'Admin'}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">{adminInfo.personal_info.fullname}</h1>
          <p className="text-lg mt-2">Email: {adminInfo.personal_info.email}</p>
          <p className="text-lg mt-2">Username: {adminInfo.personal_info.username}</p>
          <p className="text-lg mt-2">Admin: {adminInfo.personal_info.admin ? 'Yes' : 'Yes'}</p>
          <p className="text-lg mt-2">Joined: {new Date(adminInfo.joinedAt).toLocaleString()}</p>
          <p className="text-lg mt-2">Last Updated: {new Date(adminInfo.updatedAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No admin information available.</p>
      )}
    </div>
  );
};

export default Settings;
