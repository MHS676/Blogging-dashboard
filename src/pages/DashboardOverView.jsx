import React, { useEffect, useState } from 'react'
import { RiAdminLine } from 'react-icons/ri'
import { FiUsers } from "react-icons/fi";
import { FaBlog } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import axios from 'axios';
import BlogChart from './BlogChart';


const DashboardOverView = () => {
  
const [likes, setLikes] = useState([]);
const [comments, setComments] = useState([]);
const [blogCount, setBlogCount] = useState(0);
const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-likes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        setLikes(response.data);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, []);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-comments`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        setComments(response.data);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchComments();
  }, []);
  useEffect(() => {
    const fetchBlogCount = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-blog-count`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        setBlogCount(response.data.totalBlogs); // Set the blog count from response
      } catch (error) {
        console.error("Error fetching blog count:", error);
      }
    };

    fetchBlogCount();
  }, []);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-users-count`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        // Set the total users count
        if (response.data && typeof response.data.totalUsers !== 'undefined') {
          setTotalUsers(response.data.totalUsers);
        } else {
          console.error("Total users count not found in the response", response);
        }
      } catch (error) {
        console.error("Error fetching users count:", error);
      }
    };

    fetchUsersCount();
  }, []);

  return (
    <div>
    
      <div className='grid grid-cols-1 md:grid-cols-5 gap-8 pt-8 mx-10'>
          <div className='bg-indigo-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center'>
            <FiUsers className='size-8 text-indigo-600' />
            <p className=''> Users</p>
            <p>{totalUsers}</p>
          </div>

          <div className='bg-red-100 py-6 rounded-sm space-y-1 flex flex-col items-center shadow-sm'>
            <FaBlog className='size-8 text-red-600' />
            <p className=''> Blogs</p>
            <p>{blogCount}</p>
          </div>

          <div className='bg-lime-100 py-6 rounded-sm space-y-1 flex flex-col items-center shadow-sm'>
            <RiAdminLine className='size-8 text-lime-600' />
            <p className=''>
              Admin
            </p>
          </div>

          <div className='bg-orange-100 py-6 rounded-sm space-y-1 flex flex-col items-center shadow-sm'>
            <FiUsers className='size-8 text-orange-600' />
            <p className=''> Comments</p>
            <p>{comments.length}</p>
          </div>

          <div className='bg-yellow-100 py-6 rounded-sm space-y-1 flex flex-col items-center shadow-sm'>
            <SlLike className='size-8 text-yellow-600' />
            <p className=''> Likes</p>
            <p>{likes.length}</p>
          </div>
        </div>
         <div className='mt-20'>
            <BlogChart/>
         </div>
    </div>
  )
}

export default DashboardOverView