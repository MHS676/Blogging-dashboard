// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  const login = async (email, password) => {
    try {
      const response = await axios.post('/admin-signin', { email, password });
      const { access_token, role, ...user } = response.data;

      if (role !== 'admin') {
        return { success: false, error: 'Access denied: Admins only.' };
      }

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuth({ accessToken: access_token, user });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    setAuth({ accessToken: null, user: null });

    navigate('/admin');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
