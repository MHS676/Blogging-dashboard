// src/components/Dashboard.jsx
import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { RiDashboardHorizontalFill } from 'react-icons/ri';
import { SiNginxproxymanager } from "react-icons/si";
import { MdManageAccounts } from "react-icons/md";
import { LiaComments } from "react-icons/lia";
import { FaHashtag } from "react-icons/fa";
import { IoSettings, IoLogOut } from "react-icons/io5";
import { UserContext } from '../App';  // Ensure correct import path
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserContext);  // Accessing UserContext to manage auth

  const handleLogout = () => {
    setUserAuth(null);
    localStorage.removeItem("user"); // Clear user session
    navigate("/signin");
  };

  return (
    <>
      
      <div className="drawer lg:drawer-open min-h-screen">
      
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Sidebar */}
      <div className="drawer-side">
      
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content w-72 p-4 flex flex-col gap-6 h-full">
        <div className=" ml-20 mt-3">
    <a className=" text-xl">Admin</a>
  </div>
          {/* Sidebar Content */}
          <li className='mt-5'>
            <NavLink 
              to="/admin/overview" 
              className={({ isActive }) => 
                isActive 
                  ? "active bg-primary text-white flex items-center p-2 rounded" 
                  : "text-base-content flex items-center p-2 rounded hover:bg-base-300"
              }
            >
              <RiDashboardHorizontalFill className="mr-2" /> Dashboard Overview
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/posts" 
              className={({ isActive }) => 
                isActive 
                  ? "active bg-primary text-white flex items-center p-2 rounded" 
                  : "text-base-content flex items-center p-2 rounded hover:bg-base-300"
              }
            >
              <SiNginxproxymanager className="mr-2" /> Posts Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/comments" 
              className={({ isActive }) => 
                isActive 
                  ? "active bg-primary text-white flex items-center p-2 rounded" 
                  : "text-base-content flex items-center p-2 rounded hover:bg-base-300"
              }
            >
              <LiaComments className="mr-2" /> Comments Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                isActive 
                  ? "active bg-primary text-white flex items-center p-2 rounded" 
                  : "text-base-content flex items-center p-2 rounded hover:bg-base-300"
              }
            >
              <MdManageAccounts className="mr-2" /> Users Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/categories" 
              className={({ isActive }) => 
                isActive 
                  ? "active bg-primary text-white flex items-center p-2 rounded" 
                  : "text-base-content flex items-center p-2 rounded hover:bg-base-300"
              }
            >
              <FaHashtag className="mr-2" /> Categories/Tags 
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/settings" 
              className={({ isActive }) => 
                isActive 
                  ? "active bg-primary text-white flex items-center p-2 rounded" 
                  : "text-base-content flex items-center p-2 rounded hover:bg-base-300"
              }
            >
              <IoSettings className="mr-2" /> Site Settings
            </NavLink>
          </li>
          <li className="mt-auto">
            {/* Logout Button */}
            <button 
              onClick={handleLogout} // Added logout handler
              className="flex items-center w-full text-left text-base-content hover:bg-red-500 hover:text-white p-2 rounded"
            >
              <IoLogOut className="mr-2" /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="drawer-content">
          <Navbar />
        <Outlet /> 
      </div>
    </div>
    </>
  );
};

export default Dashboard;
