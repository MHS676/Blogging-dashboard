// src/App.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Comments from './pages/Comments';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import DashboardOverView from './pages/DashboardOverView';
import UserAuthFormDash from './pages/UserAuthFormDash';
import { lookInLocal } from './common/session'; // Correct import

// Create a context for user authentication
export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState(null);

  // Check if the user is authenticated by checking localStorage for the token
  useEffect(() => {
    const token = lookInLocal('user'); // Use localStorage
    if (token) {
      setUserAuth(JSON.parse(token));
    }
  }, []);

  // Protecting routes by checking if user is authenticated
  const ProtectedRoute = ({ children }) => {
    if (!userAuth) {
      return <Navigate to="/signin" replace />; // Redirect to sign-in if not authenticated
    }
    return children;
  };

  // Define routes
  const routes = useRoutes([
    { path: "/signin", element: <UserAuthFormDash /> }, // Sign-in page
    {
      path: '/admin',
      element: (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </UserContext.Provider>
      ),
      children: [
        { path: '', element: <Navigate to="/admin/overview" replace /> },
        { path: 'overview', element: <DashboardOverView /> },
        { path: 'users', element: <Users /> },
        { path: 'posts', element: <Posts /> },
        { path: 'comments', element: <Comments /> },
        { path: 'categories', element: <Categories /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
    { path: '*', element: <Navigate to="/admin" replace /> }, // Redirect if no matching route
  ]);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {routes}
    </UserContext.Provider>
  );
};

export default App;
